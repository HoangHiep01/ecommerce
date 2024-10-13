import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Req,
  DefaultValuePipe,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Request } from 'express';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ApiDocument } from '../../decorators/document.decorator';

@ApiTags('Order')
@ApiBearerAuth('JWT-auth')
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @ApiDocument('Create a customer order.', 'New order was created.')
  @Post()
  create(@Body() createOrderDto: CreateOrderDto, @Req() request: Request) {
    return this.orderService.create(createOrderDto, request);
  }

  @ApiDocument('Get list orders.', 'A list orders')
  @Get()
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
  ) {
    limit = limit > 100 ? 100 : limit;
    return this.orderService.findAll({ page, limit });
  }

  @ApiDocument('Get specific order by id.', 'A order')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orderService.findOne(+id);
  }

  @ApiDocument('Update state order by id.', 'State was updated')
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
    @Req() request: Request,
  ) {
    return this.orderService.update(+id, updateOrderDto, request);
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.orderService.remove(+id);
  // }
}
