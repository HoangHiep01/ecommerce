import { Injectable, NotFoundException } from '@nestjs/common';
import { Request } from 'express';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  paginate,
  Pagination,
  IPaginationOptions,
} from 'nestjs-typeorm-paginate';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { CreateProductDto } from '../product/dto/create-product.dto';
import { Inventory } from './entities/inventory.entity';
import { ProductService } from '../product/product.service';

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(Inventory)
    private inventoryRepository: Repository<Inventory>,
    private productsService: ProductService,
  ) {}

  async create(
    quantity: number,
    createProductDto: CreateProductDto,
    request: Request,
  ): Promise<Inventory> {
    const product = await this.productsService.create(
      createProductDto,
      request,
    );

    const createInventoryDto = new CreateInventoryDto();
    createInventoryDto.quantity = quantity;
    createInventoryDto.productId = product.id;

    return await this.add(createInventoryDto, request);
  }

  async add(
    createInventoryDto: CreateInventoryDto,
    request: Request,
  ): Promise<Inventory> {
    if (await this.productsService.findOne(createInventoryDto.productId)) {
      const inventory = new Inventory();

      inventory.quantity = createInventoryDto.quantity;
      inventory.productId = createInventoryDto.productId;
      console.log(inventory, createInventoryDto);
      inventory.createBy = request['user'].sub;
      inventory.createAt = new Date();
      inventory.updateBy = request['user'].sub;
      inventory.updateAt = new Date();

      return await this.inventoryRepository.save(inventory);
    }
    throw new NotFoundException('Product id does exist.');
  }

  async findAll(options: IPaginationOptions): Promise<Pagination<Inventory>> {
    const query = this.inventoryRepository
      .createQueryBuilder('inventory')
      .leftJoinAndSelect('inventory.productId', 'product');

    return paginate<Inventory>(query, options);
  }

  async findOne(id: number): Promise<Inventory | undefined> {
    const query = await this.inventoryRepository
      .createQueryBuilder('inventory')
      .leftJoinAndSelect('inventory.productId', 'product')
      .where('inventory.id = :id', { id });
    return await query.getOne();
  }

  async update(
    id: number,
    updateInventoryDto: UpdateInventoryDto,
    request: Request,
  ) {
    await this.inventoryRepository.update(id, updateInventoryDto);
    await this.inventoryRepository.update(id, {
      updateBy: request['user'].sub,
      updateAt: new Date(),
    });
  }

  async remove(id: number, request: Request) {
    if (await this.productsService.findOne(id)) {
      return await this.inventoryRepository.update(id, {
        isDelete: true,
        deleteBy: request['user'].sub,
        deletedAt: new Date(),
      });
    }
    throw new NotFoundException("Product does't exist in inventory.");
  }
}
