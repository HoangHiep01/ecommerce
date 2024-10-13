import { Injectable } from '@nestjs/common';
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
  ) {}

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
      return genenateReturnObject(200, data);
    } catch (e) {
      return genenateReturnObject(e.statusCode, {}, (e as Error).message);
    }
  }
  async findAll(options: IPaginationOptions): Promise<object> {
    try {
      const query = this.productsRepository.createQueryBuilder();
      // const data = await this.productsRepository.find();
      const data = await paginate<Product>(query, options);
      return genenateReturnObject(200, data);
    } catch (e) {
      return genenateReturnObject(e.statusCode, {}, (e as Error).message);
    }
  }
  async findOne(id: number): Promise<object> {
    try {
      const data = await this.productsRepository.findOneBy({
        id: id,
      });
      if (!data) {
        return genenateReturnObject(404, {}, 'Product not found');
      }
      return genenateReturnObject(200, data);
    } catch (e) {
      return genenateReturnObject(e.statusCode, {}, (e as Error).message);
    }
  }
  async update(
    id: number,
    updateProductDto: UpdateProductDto,
    request: Request,
  ): Promise<object> {
    try {
      const product = await this.productsRepository.findOneBy({
        id: id,
      });
      if (!product) {
        return genenateReturnObject(404, {}, 'Product not found');
      }
      await this.productsRepository.update(id, {
        updatedBy: request['user'].sub,
      });
      await this.productsRepository.update(id, updateProductDto);
      const data = await this.findOne(id);
      return genenateReturnObject(200, data);
    } catch (e) {
      return genenateReturnObject(e.statusCode, {}, (e as Error).message);
    }
  }
  async remove(id: number, request: Request): Promise<object> {
    try {
      const product = await this.productsRepository.findOneBy({
        id: id,
        deletedAt: null,
      });
      if (!product) {
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
      return genenateReturnObject(200, data);
    } catch (e) {
      return genenateReturnObject(e.statusCode, {}, (e as Error).message);
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
        return genenateReturnObject(404, {}, 'Product not found');
      }
      await this.productsRepository.update(id, {
        updatedBy: request['user'].sub,
      });
      await this.productsRepository
        .createQueryBuilder()
        .restore()
        .where('id = :id', { id: id })
        .execute();
      return await this.findOne(id);
    } catch (e) {
      return genenateReturnObject(e.statusCode, {}, (e as Error).message);
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
      return genenateReturnObject(200, data);
    } catch (e) {
      return genenateReturnObject(e.statusCode, {}, (e as Error).message);
    }
  }
}
