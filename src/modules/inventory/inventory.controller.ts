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
import { InventoryService } from './inventory.service';
import { Request } from 'express';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { AddInventoryDto } from './dto/add-inventory.dto';
import { ApiDocument } from '../../decorators/document.decorator';

@ApiBearerAuth('JWT-auth')
@ApiTags('Inventory')
@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Post('create')
  @ApiDocument(
    'Create new producta and add into inventory.',
    'Product is created and added into inventory.',
  )
  create(
    @Body() createInventoryDto: CreateInventoryDto,
    @Req() request: Request,
  ) {
    return this.inventoryService.create(createInventoryDto, request);
  }

  @Post('add')
  @ApiDocument(
    'Add existing product into inventory.',
    'Product is added into inventory.',
  )
  add(@Body() addInventoryDto: AddInventoryDto, @Req() request: Request) {
    return this.inventoryService.add(addInventoryDto, request);
  }

  @ApiDocument(
    'Get all product in inventory with pagination.',
    'Page of product in inventory.',
  )
  @Get()
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
  ) {
    limit = limit > 100 ? 100 : limit;
    return this.inventoryService.findAll({ page, limit });
  }

  @ApiDocument(
    'Get product in inventory with id.',
    'Product information if it exist.',
  )
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.inventoryService.findOne(+id);
  }

  @ApiDocument(
    'Update product information in inventory, mainly focuse on update quantity.',
    'Product information is updated.',
  )
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateInventoryDto: UpdateInventoryDto,
    @Req() request: Request,
  ) {
    return this.inventoryService.update(+id, updateInventoryDto, request);
  }

  @ApiDocument(
    'Deleting a product in inventory but actually marking the product as deleted.',
    'Item is marked as deleted.',
  )
  @Delete(':id')
  remove(@Param('id') id: string, @Req() request: Request) {
    return this.inventoryService.remove(+id, request);
  }

  @ApiDocument(
    'Restore a product in inventory that marked as deleted',
    'Item is back.',
  )
  @Post(':id')
  restore(@Param('id') id: string, @Req() request: Request) {
    return this.inventoryService.restore(+id, request);
  }
}
