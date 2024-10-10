import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { Repository } from 'typeorm';
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
    if (!(await this.customersService.findOne(createCartDto.customer))) {
      return { error: { message: 'Customer not found.' } };
    }

    if (
      await this.cartRepository.findOneBy({
        customer: createCartDto.customer,
      })
    ) {
      return { error: { message: 'Customer already has a cart.' } };
    }

    const cart = new Cart();
    cart.customer = createCartDto.customer;
    cart.createBy = request['user'].sub;
    cart.updateBy = request['user'].sub;
    const isCartSaved = await this.cartRepository.save(cart);

    if (isCartSaved) {
      return {
        data: {
          isCartSaved,
        },
      };
    }

    return { error: { message: 'Can not create cart.' } };
  }

  async add(
    cartId: number,
    request: Request,
    addItemDto: AddItemDto,
  ): Promise<object> {
    if (!(await this.cartRepository.findOneBy({ id: cartId }))) {
      return { error: { message: 'Cart not found.' } };
    }
    if (!(await this.inventoryService.findOne(addItemDto.inventoryId))) {
      return { error: { message: 'Can not find product in inventory.' } };
    }

    const isItemInCart = await this.cartItemRepository.findOneBy({
      cart: cartId,
      inventory: addItemDto.inventoryId,
    });
    if (isItemInCart) {
      isItemInCart.quantity += addItemDto.quantity;
      const updateItem = await this.cartItemRepository.save(isItemInCart);
      return { data: updateItem };
    }
    const item = new CartItem();
    item.cart = cartId;
    item.inventory = addItemDto.inventoryId;
    item.quantity = addItemDto.quantity;

    const addItem = await this.cartItemRepository.save(item);

    return await this.findOne(addItem.cart);
  }

  async findAll(options: IPaginationOptions): Promise<object> {
    const query = this.cartRepository.createQueryBuilder('cart');
    return { data: await paginate<Cart>(query, options) };
  }

  async findOne(cartId: number) {
    const cart = await this.cartRepository.findOneBy({ id: cartId });
    if (!cart) {
      return { error: { message: 'Cart not found.' } };
    }
    const customer = await this.customersService.findOne(cart.customer);

    const items = await this.cartItemRepository.find({
      select: {
        inventory: true,
        quantity: true,
      },
      where: {
        cart: cartId,
      },
    });

    return { data: { cart, customer, items } };
  }

  async updateItem(
    cartId: number,
    itemId: number,
    updateItemDto: UpdateItemDto,
    request: Request,
  ): Promise<object> {
    if (!(await this.cartRepository.findOneBy({ id: cartId }))) {
      return { error: { message: 'Cart not found.' } };
    }
    if (!(await this.inventoryService.findOne(itemId))) {
      return { error: { message: 'Can not find product in inventory.' } };
    }

    const isItemInCart = await this.cartItemRepository.findOneBy({
      cart: cartId,
      inventory: itemId,
    });
    if (isItemInCart) {
      await this.cartItemRepository.update(isItemInCart.id, {
        updateBy: request['user'].sub,
        updateAt: new Date(),
      });
      const updateItem = await this.cartItemRepository.update(
        isItemInCart.id,
        updateItemDto,
      );
      return { data: updateItem };
    }
    return { error: { message: 'Something went wrong.' } };
  }

  async updateCart(
    cartId: number,
    updateCartDto: UpdateCartDto,
    request: Request,
  ): Promise<object> {
    const cart = await this.cartRepository.findOneBy({ id: cartId });
    if (!cart) {
      return { error: { message: 'Cart not found.' } };
    }
    console.log(updateCartDto);
    await this.cartRepository.update(cartId, updateCartDto);
    await this.cartRepository.update(cartId, {
      updateBy: request['user'].sub,
      updateAt: new Date(),
    });

    return await this.findOne(cartId);
  }

  remove(id: number) {
    return `This action removes a #${id} cart`;
  }
}
