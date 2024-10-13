import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  DefaultValuePipe,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Request } from 'express';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { AddItemDto } from './dto/add-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { ApiDocument } from '../../decorators/document.decorator';

@ApiTags('Cart')
@ApiBearerAuth('JWT-auth')
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @ApiDocument('Create a new cart.', 'A new cart was created.')
  @Post()
  create(@Body() createCartDto: CreateCartDto, @Req() request: Request) {
    return this.cartService.create(createCartDto, request);
  }

  @ApiDocument('Add item into cart.', 'Item was added into cart.')
  @Post('/:cartId')
  add(
    @Param('cartId') cartId: string,
    @Req() request: Request,
    @Body() addItemDto: AddItemDto,
  ) {
    return this.cartService.add(+cartId, request, addItemDto);
  }

  @ApiDocument('Get list cart', 'List carts.')
  @Get()
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
  ) {
    limit = limit > 100 ? 100 : limit;
    return this.cartService.findAll({ page, limit });
  }

  @ApiDocument(
    'Get cart information: customer, list product.',
    'Cart information.',
  )
  @Get(':cartId')
  findOne(@Param('cartId') cartId: string) {
    return this.cartService.findOne(+cartId);
  }

  @ApiDocument(
    'Update product quantity in cart.',
    'Product quantity was updated.',
  )
  @Patch('/:cartId/item/:itemId')
  updateItem(
    @Param('cartId') cartId: string,
    @Param('itemId') itemId: string,
    @Body() updateItemDto: UpdateItemDto,
    @Req() request: Request,
  ) {
    return this.cartService.updateItem(
      +cartId,
      +itemId,
      updateItemDto,
      request,
    );
  }

  @ApiDocument('Update cart information.', 'Cart information was updated.')
  @Patch('/:cartId')
  updateCart(
    @Param('cartId') cartId: string,
    @Body() updateCartDto: UpdateCartDto,
    @Req() request: Request,
  ) {
    return this.cartService.updateCart(+cartId, updateCartDto, request);
  }

  @ApiDocument(
    'Sort remove product out of cart.',
    'Product is marked as out of cart.',
  )
  @Delete(':cardId/item/:itemId')
  remove(
    @Param('cardId') cardId: string,
    @Param('itemId') itemId: string,
    @Req() request: Request,
  ) {
    return this.cartService.remove(+cardId, +itemId, request);
  }

  @ApiDocument(
    'Restore item in cart marked as delete.',
    'Item restore in cart.',
  )
  @Post(':cardId/item/:itemId')
  restore(
    @Param('cardId') cardId: string,
    @Param('itemId') itemId: string,
    @Req() request: Request,
  ) {
    return this.cartService.restore(+cardId, +itemId, request);
  }
}
