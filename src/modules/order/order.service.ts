import { Injectable, Logger } from '@nestjs/common';
import { Request } from 'express';
import { Repository, Equal } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { paginate, IPaginationOptions } from 'nestjs-typeorm-paginate';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { CustomersService } from '../customers/customers.service';
import { CartService } from '../cart/cart.service';
import { InventoryService } from '../inventory/inventory.service';
import { genenateReturnObject } from '../../constants/return-object';
import { OrderState } from '../../constants/order-state';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,
    private cartService: CartService,
    private customersService: CustomersService,
    private inventoryService: InventoryService,
    private logger: Logger,
  ) {}

  SERVICE: string = OrderService.name;

  async create(
    createOrderDto: CreateOrderDto,
    request: Request,
  ): Promise<object> {
    try {
      const isCartExist = await this.cartService.findOne(createOrderDto.cartId);
      if (isCartExist['statusCode'] != 200) {
        return isCartExist;
      }

      const items = isCartExist['data'].items;
      const canMakeOrder = items.every(
        (item) => item['inventory'].quantity >= item.quantity,
      );
      if (!canMakeOrder) {
        this.logger.log('Product is not enough to order', this.SERVICE);
        return genenateReturnObject(400, {}, 'Product is not enough to order.');
      }

      const order = new Order();
      order.customer = isCartExist['data']['customer'].id;

      if (createOrderDto.orderState) {
        order.state = createOrderDto.orderState;
      }
      order.createdBy = request['user'].sub;
      order.updatedBy = request['user'].sub;
      const ordered = await this.orderRepository.save(order);
      if (!ordered) {
        this.logger.log('Can not creat order', this.SERVICE);
        return genenateReturnObject(400, {}, 'Can not creat order.');
      }

      for (const item of items) {
        const orderItem = new OrderItem();
        orderItem.order = ordered;
        orderItem.inventory = item['inventory'].id;
        orderItem.quantity = item.quantity;
        orderItem.createdBy = request['user'].sub;
        orderItem.updatedBy = request['user'].sub;
        if (!(await this.orderItemRepository.save(orderItem))) {
          // back all item have been added with ordered.id
          return genenateReturnObject(400, {}, 'Can not creat order.');
        }
        await this.inventoryService.update(
          item['inventory'].id,
          { quantity: item['inventory'].quantity - item.quantity },
          request,
        );
        await this.cartService.remove(
          isCartExist['data'].id,
          item['inventory'].id,
          request,
        );
      }
      this.logger.log('Order created successfully', this.SERVICE);
      return await this.findOne(order.id);
    } catch (error) {
      this.logger.error('Unable to create order', error.stack, this.SERVICE);
      return genenateReturnObject(error.statusCode, {}, error.message);
    }
  }

  async findAll(options: IPaginationOptions): Promise<object> {
    try {
      const query = this.orderRepository.createQueryBuilder('order');
      const data = await paginate<Order>(query, options);
      this.logger.log(`List orders fetched successfully`, this.SERVICE);
      return genenateReturnObject(200, data, '');
    } catch (error) {
      this.logger.error(
        'Unable to fetch list orders',
        error.stack,
        this.SERVICE,
      );
      return genenateReturnObject(error.statusCode, {}, error.message);
    }
  }

  async findOne(orderId: number): Promise<object> {
    try {
      const order = await this.orderRepository.findOneBy({ id: orderId });
      if (!order) {
        this.logger.log(`Order not found ${orderId}`, this.SERVICE);
        return genenateReturnObject(404, {}, 'Order not found.');
      }

      const items = await this.orderItemRepository.find({
        where: {
          order: Equal(order.id),
        },
      });
      order['items'] = items;
      this.logger.log(`Order fetched successfully ${orderId}`, this.SERVICE);
      return genenateReturnObject(200, order);
    } catch (error) {
      this.logger.error('Unable to fetch order', error.stack, this.SERVICE);
      return genenateReturnObject(error.statusCode, {}, error.message);
    }
  }

  async update(
    orderId: number,
    updateOrderDto: UpdateOrderDto,
    request: Request,
  ): Promise<object> {
    try {
      const order = await this.orderRepository.findOneBy({ id: orderId });
      if (!order) {
        this.logger.log(`Order not found ${orderId}`, this.SERVICE);
        return genenateReturnObject(404, {}, 'Order not found.');
      }
      if (!updateOrderDto.orderState) {
        this.logger.log(
          `Request update something is not state of order ${orderId}`,
          this.SERVICE,
        );
        return genenateReturnObject(
          400,
          {},
          'Only allowing update order state.',
        );
      }
      if (order.state == OrderState.CANCELED) {
        this.logger.log(
          `Order have been canceled, but call update state ${orderId}`,
          this.SERVICE,
        );
        return genenateReturnObject(
          400,
          {},
          'Not implement bussiness logic to update order have been canceled.',
        );
      }

      await this.orderRepository.update(orderId, {
        updatedBy: request['user'].sub,
        state: updateOrderDto.orderState,
      });
      this.logger.log(`Order updated successfully ${orderId}`, this.SERVICE);
      return await this.findOne(order.id);
    } catch (error) {
      this.logger.error('Unable to update order', error.stack, this.SERVICE);
      return genenateReturnObject(error.statusCode, {}, error.message);
    }
  }

  // remove(id: number) {
  //   return `This action removes a #${id} order`;
  // }
}
