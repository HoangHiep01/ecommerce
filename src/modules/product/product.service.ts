import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { Repository, IsNull, Not } from 'typeorm';
import { paginate, IPaginationOptions } from 'nestjs-typeorm-paginate';
import { genenateReturnObject } from '../../constants/return-object';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    private logger: Logger,
  ) {}

  SERVICE: string = ProductService.name;

  async create(
    createProductDto: CreateProductDto,
    request: Request,
  ): Promise<object> {
    try {
      const product = new Product();

      product.name = createProductDto.name;
      product.description = createProductDto.description;
      product.price = createProductDto.price;

      product.createdBy = request['user'].sub;
      product.updatedBy = request['user'].sub;

      const data = await this.productsRepository.save(product);
      this.logger.log(`Product created successfully ${data.id}`, this.SERVICE);
      return genenateReturnObject(200, data);
    } catch (error) {
      this.logger.error('Unable to create product', error.stack, this.SERVICE);
      return genenateReturnObject(error.statusCode, {}, error.message);
    }
  }
  async findAll(options: IPaginationOptions): Promise<object> {
    try {
      const query = this.productsRepository.createQueryBuilder();
      // const data = await this.productsRepository.find();
      const data = await paginate<Product>(query, options);
      this.logger.log(`List products fetched successfully`, this.SERVICE);
      return genenateReturnObject(200, data);
    } catch (error) {
      this.logger.error(
        'Unable to fetch list products',
        error.stack,
        this.SERVICE,
      );
      return genenateReturnObject(error.statusCode, {}, error.message);
    }
  }
  async findOne(id: number): Promise<object> {
    try {
      const data = await this.productsRepository.findOneBy({
        id: id,
      });
      if (!data) {
        this.logger.log(`Product not found ${id}`, this.SERVICE);
        return genenateReturnObject(404, {}, 'Product not found');
      }
      this.logger.log(`Customer fetched successfully ${id}`, this.SERVICE);
      return genenateReturnObject(200, data);
    } catch (error) {
      this.logger.error('Unable to fetch product', error.stack, this.SERVICE);
      return genenateReturnObject(error.statusCode, {}, error.message);
    }
  }
  async update(
    id: number,
    updateProductDto: UpdateProductDto,
    request: Request,
  ): Promise<object> {
    try {
      const product = await this.findOne(id);
      if (!product) {
        this.logger.log(
          'Unable to update product because product not found',
          this.SERVICE,
        );
        return genenateReturnObject(
          409,
          {},
          'Email or phonenumber already exist',
        );
        return genenateReturnObject(404, {}, 'Product not found');
      }
      await this.productsRepository.update(id, {
        updatedBy: request['user'].sub,
      });
      await this.productsRepository.update(id, updateProductDto);
      const data = await this.findOne(id);
      this.logger.log(`Product updated successfully ${id}`, this.SERVICE);
      return genenateReturnObject(200, data);
    } catch (error) {
      this.logger.error('Unable to update product', error.stack, this.SERVICE);
      return genenateReturnObject(error.statusCode, {}, error.message);
    }
  }
  async remove(id: number, request: Request): Promise<object> {
    try {
      const product = await this.findOne(id);
      if (!product) {
        this.logger.log(
          'Unable to delete product because product not found',
          this.SERVICE,
        );
        return genenateReturnObject(404, {}, 'Product not found');
      }
      await this.productsRepository.update(id, {
        deletedBy: request['user'].sub,
      });
      await this.productsRepository
        .createQueryBuilder()
        .softDelete()
        .where('id = :id', { id: id })
        .execute();
      const data = await this.productsRepository.find({
        where: {
          id: id,
          deletedAt: Not(IsNull()),
        },
        withDeleted: true,
      });
      this.logger.log(`Product deleted successfully ${id}`, this.SERVICE);
      return genenateReturnObject(200, data);
    } catch (error) {
      this.logger.error('Unable to delete product', error.stack, this.SERVICE);
      return genenateReturnObject(error.statusCode, {}, error.message);
    }
  }

  async restore(id: number, request: Request): Promise<object> {
    try {
      const product = await this.productsRepository.findOne({
        where: {
          id: id,
          deletedAt: Not(IsNull()),
        },
        withDeleted: true,
      });
      if (!product) {
        this.logger.log(
          `Product marked as deleted not found ${id}`,
          this.SERVICE,
        );
        return genenateReturnObject(
          404,
          {},
          'Product masked as deleted not found',
        );
      }
      await this.productsRepository.update(id, {
        updatedBy: request['user'].sub,
      });
      await this.productsRepository
        .createQueryBuilder()
        .restore()
        .where('id = :id', { id: id })
        .execute();
      this.logger.log(`Product restored successfully ${id}`, this.SERVICE);
      return await this.findOne(id);
    } catch (error) {
      this.logger.error(
        'Unable to restore customer',
        error.stack,
        this.SERVICE,
      );
      return genenateReturnObject(error.statusCode, {}, error.message);
    }
  }

  async searchProductPaginate(
    context: string,
    options: IPaginationOptions,
  ): Promise<object> {
    try {
      const querySearchProduct = this.productsRepository
        .createQueryBuilder('products')
        .where(
          `products.name LIKE '%${context}%' OR products.description LIKE '%${context}%'`,
        )
        .andWhere(`products.deletedAt = ${null}`);
      const data = await paginate<Product>(querySearchProduct, options);
      this.logger.log(
        `List search products fetched successfully`,
        this.SERVICE,
      );
      return genenateReturnObject(200, data);
    } catch (error) {
      return genenateReturnObject(error.statusCode, {}, error.message);
    }
  }
}
