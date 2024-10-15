import { Injectable, Logger } from '@nestjs/common';
import { Request } from 'express';
import { Repository, Equal, Not, IsNull } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { paginate, IPaginationOptions } from 'nestjs-typeorm-paginate';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { AddItemDto } from './dto/add-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cart-item.entity';
import { CustomersService } from '../customers/customers.service';
import { InventoryService } from '../inventory/inventory.service';
import { genenateReturnObject } from '../../constants/return-object';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,
    @InjectRepository(CartItem)
    private cartItemRepository: Repository<CartItem>,
    private customersService: CustomersService,
    private inventoryService: InventoryService,
    private logger: Logger,
  ) {}

  SERVICE: string = CartService.name;

  async create(
    createCartDto: CreateCartDto,
    request: Request,
  ): Promise<object> {
    try {
      const customer = await this.customersService.findOne(
        createCartDto.customerId,
      );
      if (customer['statusCode'] != 200) {
        this.logger.log('Customer not found to create cart', this.SERVICE);
        return genenateReturnObject(400, {}, 'Customer not found');
      }

      // https://github.com/typeorm/typeorm/issues/2500
      const existCart = await this.cartRepository.findOne({
        where: { customer: Equal(createCartDto.customerId) },
      });
      if (existCart) {
        this.logger.log('Customer already has a cart', this.SERVICE);
        return genenateReturnObject(
          201,
          existCart,
          'Customer already has a cart.',
        );
      }

      const cart = new Cart();
      cart.customer = createCartDto.customerId;
      cart.createdBy = request['user'].sub;
      cart.updatedBy = request['user'].sub;
      const data = await this.cartRepository.save(cart);

      this.logger.log(`Cart created successfully ${data.id}`, this.SERVICE);
      return genenateReturnObject(200, data);
    } catch (error) {
      this.logger.error('Unable to create customer', error.stack, this.SERVICE);
      return genenateReturnObject(error.statusCode, {}, error.message);
    }
  }

  async add(
    cartId: number,
    request: Request,
    addItemDto: AddItemDto,
  ): Promise<object> {
    try {
      const isCartExist = await this.cartRepository.findOneBy({
        id: Equal(cartId),
      });
      if (!isCartExist) {
        this.logger.log('Cart not found to add item', this.SERVICE);
        return genenateReturnObject(404, {}, 'Cart not found.');
      }

      const isItemExist = await this.inventoryService.findOne(
        addItemDto.inventoryId,
      );
      if (isItemExist['statusCode'] != 200) {
        this.logger.log('Product not found in inventory', this.SERVICE);
        return genenateReturnObject(404, {}, 'Product not found in inventory');
      }

      const isItemInCart = await this.cartItemRepository.findOne({
        where: {
          cart: Equal(cartId),
          inventory: Equal(addItemDto.inventoryId),
        },
      });
      if (isItemInCart) {
        isItemInCart.quantity += addItemDto.quantity;
        const updateItem = await this.cartItemRepository.save(isItemInCart);
        this.logger.log(
          'Item already in cart, increase quantity instead',
          this.SERVICE,
        );
        return genenateReturnObject(
          201,
          updateItem,
          'Product already in cart, quantity increased.',
        );
      }
      const item = new CartItem();
      item.cart = isCartExist;
      item.inventory = addItemDto.inventoryId;
      item.quantity = addItemDto.quantity;

      const addItem = await this.cartItemRepository.save(item);

      this.logger.log('Item added in cart successfully', this.SERVICE);
      return genenateReturnObject(200, addItem, '');
    } catch (error) {
      this.logger.error(
        'Unable to add item in cart',
        error.stack,
        this.SERVICE,
      );
      return genenateReturnObject(error.statusCode, {}, error.message);
    }
  }

  async findAll(options: IPaginationOptions): Promise<object> {
    try {
      const query = this.cartRepository.createQueryBuilder('cart');
      const data = await paginate<Cart>(query, options);
      this.logger.log(`List carts fetched successfully`, this.SERVICE);
      return genenateReturnObject(200, data, '');
    } catch (error) {
      this.logger.error(
        'Unable to fetch list carts',
        error.stack,
        this.SERVICE,
      );
      return genenateReturnObject(error.statusCode, {}, error.message);
    }
  }

  async findOne(cartId: number) {
    try {
      const cart = await this.cartRepository.findOne({
        where: {
          id: Equal(cartId),
        },
      });
      if (!cart) {
        this.logger.log(`Cart not found ${cartId}`, this.SERVICE);
        return genenateReturnObject(404, {}, 'Cart not found.');
      }

      const items = await this.cartItemRepository.find({
        where: {
          cart: Equal(cart.id),
        },
      });
      cart['items'] = items;
      this.logger.log(
        `Cart and items fetched successfully ${cartId}`,
        this.SERVICE,
      );
      return genenateReturnObject(200, cart);
    } catch (error) {
      this.logger.error('Unable to fetch cart', error.stack, this.SERVICE);
      return genenateReturnObject(error.statusCode, {}, error.message);
    }
  }

  async updateItem(
    cartId: number,
    itemId: number,
    updateItemDto: UpdateItemDto,
    request: Request,
  ): Promise<object> {
    try {
      const result = await this.isItemInCartValidtor(cartId, itemId);
      if (result['statusCode'] != 200) {
        this.logger.log('Not pass check item in cart', this.SERVICE);
        return result;
      }
      const itemInCart = result['data'];

      if (updateItemDto.quantity > itemInCart.quantity) {
        this.logger.log(
          'Item quantity in cart can not update because it has more than in inventory',
          this.SERVICE,
        );
        return genenateReturnObject(
          404,
          {},
          'Inventory has less product than update quantity.',
        );
      }

      await this.cartItemRepository.update(itemInCart.id, {
        updatedBy: request['user'].sub,
      });
      await this.cartItemRepository.update(itemInCart.id, updateItemDto);
      this.logger.log(
        `Item in cart updated successfully ${cartId} ${itemId}`,
        this.SERVICE,
      );
      return this.findOne(cartId);
    } catch (error) {
      this.logger.error(
        'Unable to update item in cart',
        error.stack,
        this.SERVICE,
      );
      return genenateReturnObject(error.statusCode, {}, error.message);
    }
  }

  async updateCart(
    cartId: number,
    updateCartDto: UpdateCartDto,
    request: Request,
  ): Promise<object> {
    try {
      const cart = await this.cartRepository.findOneBy({ id: cartId });

      if (!cart) {
        this.logger.log('Cart not found', this.SERVICE);
        return genenateReturnObject(404, {}, 'Cart not found.');
      }
      if (!updateCartDto.customerId) {
        return genenateReturnObject(400, {}, 'Nothing to update.');
      }
      /*
      Cart 1 to 1 Customer,
      update can break this law
      And here got error TS2559
       */

      const isCustomerInOtherCart = await this.cartRepository.findOneBy({
        customer: updateCartDto.customerId,
      });
      if (isCustomerInOtherCart) {
        this.logger.log('Customer already has cart', this.SERVICE);
        return genenateReturnObject(404, {}, 'Customer already has cart');
      }
      await this.cartRepository.update(cartId, {
        updatedBy: request['user'].sub,
        customer: updateCartDto.customerId,
      });
      return await this.findOne(cartId);
      const data = await this.findOne(cartId);
      this.logger.log('Cart information updated successfully', this.SERVICE);
      return genenateReturnObject(201, data);
    } catch (error) {
      this.logger.error(
        'Unable to update cart information',
        error.stack,
        this.SERVICE,
      );
      return genenateReturnObject(error.statusCode, {}, error.message);
    }
  }

  async remove(cartId: number, itemId: number, request: Request) {
    try {
      const result = await this.isItemInCartValidtor(cartId, itemId);
      if (result['statusCode'] != 200) {
        this.logger.log('Not pass check item in cart', this.SERVICE);
        return result;
      }

      const itemInCart = result['data'];
      await this.cartItemRepository.update(itemInCart.id, {
        deletedBy: request['user'].sub,
      });
      await this.cartItemRepository
        .createQueryBuilder()
        .softDelete()
        .where('id = :id', { id: itemInCart.id })
        .execute();
      this.logger.log(
        `Items deleted successfully from cart ${cartId} ${itemId}`,
        this.SERVICE,
      );
      return this.findOne(cartId);
    } catch (error) {
      this.logger.error(
        'Unable to delete item from cart',
        error.stack,
        this.SERVICE,
      );
      return genenateReturnObject(error.statusCode, {}, error.message);
    }
  }

  async restore(cartId: number, itemId: number, request: Request) {
    try {
      const item = await this.cartItemRepository.findOne({
        where: {
          cart: Equal(cartId),
          inventory: Equal(itemId),
          deletedAt: Not(IsNull()),
        },
        withDeleted: true,
      });
      if (!item) {
        this.logger.log(
          `Item marked as deleted in cart not found ${cartId} ${itemId}`,
          this.SERVICE,
        );
        return genenateReturnObject(
          404,
          {},
          'Item marked as delete not found in cart.',
        );
      }
      await this.cartItemRepository.update(item.id, {
        updatedBy: request['user'].sub,
      });
      await this.cartItemRepository
        .createQueryBuilder()
        .restore()
        .where('id = :id', { id: item.id })
        .execute();
      this.logger.log(
        `Item restored to cart successfully ${cartId} ${itemId}`,
        this.SERVICE,
      );
      return this.findOne(cartId);
    } catch (error) {
      this.logger.error('Unable to restore item', error.stack, this.SERVICE);
      return genenateReturnObject(error.statusCode, {}, error.message);
    }
  }

  /*
  Validate data logic
   */
  async isItemInCartValidtor(cartId: number, itemId: number): Promise<object> {
    try {
      const isCartExist = await this.cartRepository.findOneBy({ id: cartId });
      if (!isCartExist) {
        return genenateReturnObject(404, {}, 'Cart not found.');
      }

      const isItemExist = await this.inventoryService.findOne(itemId);
      if (isItemExist['statusCode'] != 200) {
        return genenateReturnObject(
          404,
          {},
          'Can not find product in inventory.',
        );
      }

      const isItemInCart = await this.cartItemRepository.findOneBy({
        cart: Equal(isCartExist.id),
        inventory: Equal(isItemExist['data'].id),
      });

      if (!isItemInCart) {
        this.logger.log('Item not found in cart', this.SERVICE);
        return genenateReturnObject(404, {}, 'Product not found in cart.');
      }
      this.logger.log('CHECK', this.SERVICE);
      return genenateReturnObject(200, isItemInCart);
    } catch (error) {
      this.logger.error('Unable to check', error.stack, this.SERVICE);
      return genenateReturnObject(error.statusCode, {}, error.message);
    }
  }
}
