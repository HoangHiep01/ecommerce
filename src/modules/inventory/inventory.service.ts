import { Injectable, Logger } from '@nestjs/common';
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
    private logger: Logger,
  ) {}

  SERVICE: string = InventoryService.name;

  async create(
    createInventoryDto: CreateInventoryDto,
    request: Request,
  ): Promise<object> {
    try {
      const product = await this.productsService.create(
        createInventoryDto,
        request,
      );

      if (product['statusCode'] != 200) {
        this.logger.log(
          'Unable to create product and add into inventory',
          this.SERVICE,
        );
        return genenateReturnObject(
          400,
          {},
          'Can not create product and add it into inventory',
        );
      }
      const addInventoryDto = new AddInventoryDto();
      addInventoryDto.quantity = createInventoryDto.quantity;
      addInventoryDto.productId = product['data'].id;
      const result = await this.add(addInventoryDto, request);
      if (result['statusCode'] != 200) {
        this.logger.log(
          `Product created but can not add into inventory`,
          this.SERVICE,
        );
      } else {
        this.logger.log(
          `Product added into inventory successfully ${result['data'].id}`,
          this.SERVICE,
        );
      }
      return result;
    } catch (error) {
      this.logger.error(
        'Unable to create product and add it into inventory',
        error.stack,
        this.SERVICE,
      );
      return genenateReturnObject(error.statusCode, {}, error.message);
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
      inventory.createdBy = request['user'].sub;
      inventory.updatedBy = request['user'].sub;

      const data = await this.inventoryRepository.save(inventory);
      this.logger.log(
        `Product added into inventory successfully ${data.id}`,
        this.SERVICE,
      );
      return genenateReturnObject(200, data);
    } catch (error) {
      this.logger.error(
        'Unable to add product in inventory',
        error.stack,
        this.SERVICE,
      );
      return genenateReturnObject(error.statusCode, {}, error.message);
    }
  }

  async findAll(options: IPaginationOptions): Promise<object> {
    try {
      const query = this.inventoryRepository
        .createQueryBuilder('inventory')
        .leftJoinAndSelect('inventory.productId', 'product');

      const data = await paginate<Inventory>(query, options);
      this.logger.log(
        `List product in inventory fetched successfully`,
        this.SERVICE,
      );
      return genenateReturnObject(200, data);
    } catch (error) {
      this.logger.error(
        'Unable to fetch list product in inventory',
        error.stack,
        this.SERVICE,
      );
      return genenateReturnObject(error.statusCode, {}, error.message);
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
        this.logger.log(`Product not found in inventory ${id}`, this.SERVICE);
        return genenateReturnObject(400, {}, 'Product not found in inventory.');
      }
      this.logger.log(
        `Product fetched successfully from inventory ${id}`,
        this.SERVICE,
      );
      return genenateReturnObject(200, data);
    } catch (error) {
      this.logger.error(
        'Unable to fetch product from inventory',
        error.stack,
        this.SERVICE,
      );
      return genenateReturnObject(error.statusCode, {}, error.message);
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
      this.logger.log(
        `Product in inventory updated successfully ${id}`,
        this.SERVICE,
      );
      return await this.findOne(id);
    } catch (error) {
      return genenateReturnObject(error.statusCode, {}, error.message);
    }
  }

  async remove(id: number, request: Request) {
    try {
      const item = await this.findOne(id);
      if (item['statusCode'] != 200) {
        this.logger.log(
          'Unable to remove product from inventory because product not found',
          this.SERVICE,
        );
        return genenateReturnObject(404, {}, 'Product not found in inventory.');
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
          id: Equal(id),
          deletedAt: Not(IsNull()),
        },
        withDeleted: true,
      });
      this.logger.log(
        `Product in inventory deleted successfully ${id}`,
        this.SERVICE,
      );
      return genenateReturnObject(200, data);
    } catch (error) {
      this.logger.error(
        'Unable to delete product from inventory',
        error.stack,
        this.SERVICE,
      );
      return genenateReturnObject(error.statusCode, {}, error.message);
    }
  }

  async restore(id: number, request: Request): Promise<object> {
    try {
      const item = await this.inventoryRepository.findOne({
        where: {
          id: Equal(id),
          deletedAt: Not(IsNull()),
        },
        withDeleted: true,
      });
      if (!item) {
        this.logger.log(
          `Product marked as deleted not found inventory ${id}`,
          this.SERVICE,
        );
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
      this.logger.log(
        `Product restored successfully to inventory ${id}`,
        this.SERVICE,
      );
      return await this.findOne(id);
    } catch (error) {
      this.logger.error(
        'Unable to restore product to inventory',
        error.stack,
        this.SERVICE,
      );
      return genenateReturnObject(error.statusCode, {}, error.message);
    }
  }
}
