import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { Repository, Not, IsNull, Equal } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { paginate, IPaginationOptions } from 'nestjs-typeorm-paginate';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { AddInventoryDto } from './dto/add-inventory.dto';
import { Inventory } from './entities/inventory.entity';
import { ProductService } from '../product/product.service';
import { genenateReturnObject } from '../../constants/return-object';

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(Inventory)
    private inventoryRepository: Repository<Inventory>,
    private productsService: ProductService,
  ) {}

  async create(
    createInventoryDto: CreateInventoryDto,
    request: Request,
  ): Promise<object> {
    try {
      const product = await this.productsService.create(
        createInventoryDto,
        request,
      );
      // console.log(product['data']);
      if (product['statusCode'] != 200) {
        return genenateReturnObject(
          400,
          {},
          'Can not create product and add it to inventory.',
        );
      }
      const addInventoryDto = new AddInventoryDto();
      addInventoryDto.quantity = createInventoryDto.quantity;
      addInventoryDto.productId = product['data'].id;
      return await this.add(addInventoryDto, request);
    } catch (e) {
      return genenateReturnObject(e.statusCode, {}, (e as Error).message);
    }
  }

  async add(
    addInventoryDto: AddInventoryDto,
    request: Request,
  ): Promise<object> {
    try {
      const product = await this.productsService.findOne(
        addInventoryDto.productId,
      );
      if (product['statusCode'] != 200) {
        return genenateReturnObject(400, {}, 'Product not found.');
      }

      const inventory = new Inventory();
      inventory.quantity = addInventoryDto.quantity;
      inventory.productId = addInventoryDto.productId;
      console.log(inventory, addInventoryDto);
      inventory.createdBy = request['user'].sub;
      inventory.updatedBy = request['user'].sub;

      const data = await this.inventoryRepository.save(inventory);
      return genenateReturnObject(200, data);
    } catch (e) {
      return genenateReturnObject(e.statusCode, {}, (e as Error).message);
    }
  }

  async findAll(options: IPaginationOptions): Promise<object> {
    try {
      const query = this.inventoryRepository
        .createQueryBuilder('inventory')
        .leftJoinAndSelect('inventory.productId', 'product');

      const data = await paginate<Inventory>(query, options);
      return genenateReturnObject(200, data);
    } catch (e) {
      return genenateReturnObject(e.statusCode, {}, (e as Error).message);
    }
  }

  async findOne(id: number): Promise<object> {
    try {
      // const query = await this.inventoryRepository
      //   .createQueryBuilder('inventory')
      //   .leftJoinAndSelect('inventory.productId', 'product')
      //   .where('inventory.id = :id', { id });
      // const data = await query.getOne();
      const data = await this.inventoryRepository.findOne({
        where: {
          id: Equal(id),
        },
      });
      if (!data) {
        return genenateReturnObject(400, {}, 'Product not found in inventory.');
      }
      return genenateReturnObject(200, data);
    } catch (e) {
      return genenateReturnObject(e.statusCode, {}, (e as Error).message);
    }
  }

  async update(
    id: number,
    updateInventoryDto: UpdateInventoryDto,
    request: Request,
  ): Promise<object> {
    try {
      if (updateInventoryDto.quantity) {
        // await this.inventoryRepository.update(id, updateInventoryDto);
        await this.inventoryRepository.update(id, {
          updatedBy: request['user'].sub,
          quantity: updateInventoryDto.quantity,
        });
      }
      return await this.findOne(id);
    } catch (e) {
      return genenateReturnObject(e.statusCode, {}, (e as Error).message);
    }
  }

  async remove(id: number, request: Request) {
    try {
      const item = await this.inventoryRepository.findOneBy({
        id: id,
        deletedAt: null,
      });
      if (!item) {
        return genenateReturnObject(404, {}, 'Item not found in inventory.');
      }
      await this.inventoryRepository.update(id, {
        deletedBy: request['user'].sub,
      });
      await this.inventoryRepository
        .createQueryBuilder()
        .softDelete()
        .where('id = :id', { id: id })
        .execute();
      const data = await this.inventoryRepository.find({
        where: {
          id: id,
          deletedAt: Not(IsNull()),
        },
        withDeleted: true,
      });
      return genenateReturnObject(200, data);
    } catch (e) {
      return genenateReturnObject(e.statusCode, {}, (e as Error).message);
    }
  }

  async restore(id: number, request: Request): Promise<object> {
    try {
      const item = await this.inventoryRepository.findOne({
        where: {
          id: id,
          deletedAt: Not(IsNull()),
        },
        withDeleted: true,
      });
      if (!item) {
        return genenateReturnObject(
          404,
          {},
          'Item marked as delete not found in inventory.',
        );
      }
      await this.inventoryRepository.update(id, {
        updatedBy: request['user'].sub,
      });
      await this.inventoryRepository
        .createQueryBuilder()
        .restore()
        .where('id = :id', { id: id })
        .execute();
      return await this.findOne(id);
    } catch (e) {
      return genenateReturnObject(e.statusCode, {}, (e as Error).message);
    }
  }
}
