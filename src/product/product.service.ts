import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
  ) {}

  async create(
    createProductDto: CreateProductDto,
    request: Request,
  ): Promise<Product> {
    const product = new Product();

    product.name = createProductDto.name;
    product.description = createProductDto.description;
    product.price = createProductDto.price;
    // First one created will be first one updated.
    product.createBy = request['user'].sub;
    product.updateBy = request['user'].sub;
    // createAt and updateAt will be auto add Date.now() in table.
    return await this.productsRepository.save(product);
  }
  async findAll(): Promise<Product[]> {
    return await this.productsRepository.findBy({
      isDelete: false,
    });
  }
  async findOne(id: number): Promise<Product | undefined> {
    const result = await this.productsRepository.findOneBy({
      id: id,
      isDelete: false,
    });
    if (!result) {
      throw new NotFoundException('Product not found.');
    }
    return result;
  }
  async update(
    id: number,
    updateProductDto: UpdateProductDto,
    request: Request,
  ): Promise<any> {
    const product = await this.productsRepository.findOneBy({ id });
    if (!product) {
      throw new NotFoundException('Product not found.');
    }
    await this.productsRepository.update(id, updateProductDto);
    await this.productsRepository.update(id, {
      updateBy: request['user'].sub,
      updateAt: new Date(),
    });
  }
  async remove(id: number, request: Request): Promise<void> {
    const product = await this.findOne(id);
    product.isDelete = true;
    product.deleteBy = request['user'].sub;
    product.deletedAt = new Date();
    await this.productsRepository.update(id, product);
  }
}
