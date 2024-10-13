import { Injectable } from '@nestjs/common';
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
  ) {}

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
      return await this.findOne(order.id);
    } catch (e) {
      return genenateReturnObject(e.statusCode, {}, (e as Error).message);
    }
  }

  async findAll(options: IPaginationOptions): Promise<object> {
    try {
      const query = this.orderRepository.createQueryBuilder('order');
      const data = await paginate<Order>(query, options);
      return genenateReturnObject(200, data, '');
    } catch (e) {
      return genenateReturnObject(e.statusCode, {}, (e as Error).message);
    }
  }

  async findOne(orderId: number): Promise<object> {
    try {
      const order = await this.orderRepository.findOneBy({ id: orderId });
      if (!order) {
        return genenateReturnObject(404, {}, 'Order not found.');
      }

      const items = await this.orderItemRepository.find({
        where: {
          order: Equal(order.id),
        },
      });
      order['items'] = items;
      return genenateReturnObject(200, order);
    } catch (e) {
      return genenateReturnObject(e.statusCode, {}, (e as Error).message);
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
        return genenateReturnObject(404, {}, 'Order not found.');
      }
      if (!updateOrderDto.orderState) {
        return genenateReturnObject(
          400,
          {},
          'Only allowing update order state.',
        );
      }
      if (order.state == OrderState.CANCELED) {
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
      return await this.findOne(order.id);
    } catch (e) {
      return genenateReturnObject(e.statusCode, {}, (e as Error).message);
    }
  }

  // remove(id: number) {
  //   return `This action removes a #${id} order`;
  // }
}
