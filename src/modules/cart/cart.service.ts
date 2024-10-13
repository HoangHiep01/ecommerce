import { Injectable } from '@nestjs/common';
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
  ) {}

  async create(
    createCartDto: CreateCartDto,
    request: Request,
  ): Promise<object> {
    try {
      const customer = await this.customersService.findOne(
        createCartDto.customerId,
      );
      if (customer['statusCode'] != 200) {
        return genenateReturnObject(400, {}, 'Customer not found');
      }

      // https://github.com/typeorm/typeorm/issues/2500
      const existCart = await this.cartRepository.findOne({
        where: { customer: Equal(createCartDto.customerId) },
      });
      if (existCart) {
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

      return genenateReturnObject(200, data);
    } catch (e) {
      return genenateReturnObject(e.statusCode, {}, (e as Error).message);
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
        return genenateReturnObject(404, {}, 'Cart not found.');
      }

      const isItemExist = await this.inventoryService.findOne(
        addItemDto.inventoryId,
      );
      if (isItemExist['statusCode'] != 200) {
        return genenateReturnObject(404, {}, 'Product not found in inventory.');
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
        return genenateReturnObject(
          201,
          updateItem,
          'Product already in cart, quantity added.',
        );
      }
      const item = new CartItem();
      item.cart = isCartExist;
      item.inventory = addItemDto.inventoryId;
      item.quantity = addItemDto.quantity;

      const addItem = await this.cartItemRepository.save(item);

      return genenateReturnObject(200, addItem, '');
    } catch (e) {
      return genenateReturnObject(e.statusCode, {}, (e as Error).message);
    }
  }

  async findAll(options: IPaginationOptions): Promise<object> {
    try {
      const query = this.cartRepository.createQueryBuilder('cart');
      const data = await paginate<Cart>(query, options);
      return genenateReturnObject(200, data, '');
    } catch (e) {
      return genenateReturnObject(e.statusCode, {}, (e as Error).message);
    }
  }

  async findOne(cartId: number) {
    try {
      const cart = await this.cartRepository.findOneBy({ id: cartId });
      if (!cart) {
        return genenateReturnObject(404, {}, 'Cart not found.');
      }
      // const customer = await this.customersService.findOne(cart.customer);

      const items = await this.cartItemRepository.find({
        where: {
          cart: Equal(cart.id),
        },
      });
      cart['items'] = items;
      return genenateReturnObject(200, cart);
    } catch (e) {
      return genenateReturnObject(e.statusCode, {}, (e as Error).message);
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
        return result;
      }
      const itemInCart = result['data'];

      if (updateItemDto.quantity > itemInCart.quantity) {
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
      return this.findOne(cartId);
    } catch (e) {
      return genenateReturnObject(e.statusCode, {}, (e as Error).message);
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

      // await this.cartRepository.update(cartId, updateCartDto);
      // await this.cartRepository.update(cartId, {
      //   updatedBy: request['user'].sub,
      // });
      // return await this.findOne(cartId);
      const data = {
        id: request['user'].sub,
      };
      return genenateReturnObject(
        201,
        data,
        'Not implement cause data relationship.',
      );
    } catch (e) {
      return genenateReturnObject(e.statusCode, {}, (e as Error).message);
    }
  }

  async remove(cartId: number, itemId: number, request: Request) {
    try {
      const result = await this.isItemInCartValidtor(cartId, itemId);
      if (result['statusCode'] != 200) {
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
      return this.findOne(cartId);
    } catch (e) {
      return genenateReturnObject(e.statusCode, {}, (e as Error).message);
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
      return this.findOne(cartId);
    } catch (e) {
      return genenateReturnObject(e.statusCode, {}, (e as Error).message);
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
        return genenateReturnObject(404, {}, 'Product not found in cart.');
      }
      return genenateReturnObject(200, isItemInCart);
    } catch (e) {
      return genenateReturnObject(e.statusCode, {}, (e as Error).message);
    }
  }
}
