import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { Repository, IsNull, Not } from 'typeorm';
import { Customer } from './entities/customer.entity';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { paginate, IPaginationOptions } from 'nestjs-typeorm-paginate';
import { genenateReturnObject } from '../../constants/return-object';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
  ) {}

  async create(
    createCustomerDto: CreateCustomerDto,
    request: Request,
  ): Promise<object> {
    try {
      const customer = new Customer();

      customer.name = createCustomerDto.name;
      customer.address = createCustomerDto.address;
      customer.phoneNumber = createCustomerDto.phoneNumber;
      customer.email = createCustomerDto.email;

      customer.createdBy = request['user'].sub;
      customer.updatedBy = request['user'].sub;

      const data = await this.customerRepository.save(customer);
      return genenateReturnObject(200, data);
    } catch (e) {
      return genenateReturnObject(e.statusCode, {}, (e as Error).message);
    }
  }

  async findAll(options: IPaginationOptions): Promise<object> {
    try {
      const query = this.customerRepository.createQueryBuilder();
      const data = await paginate<Customer>(query, options);
      return genenateReturnObject(200, data);
    } catch (e) {
      return genenateReturnObject(e.statusCode, {}, (e as Error).message);
    }
  }

  async findOne(id: number): Promise<object> {
    try {
      const customer = await this.customerRepository.findOne({ where: { id } });

      if (!customer) {
        return genenateReturnObject(404, {}, 'Customer not found.');
      }
      return genenateReturnObject(200, customer);
    } catch (e) {
      return genenateReturnObject(e.statusCode, {}, (e as Error).message);
    }
  }

  async update(
    id: number,
    updateCustomerDto: UpdateCustomerDto,
    request: Request,
  ): Promise<object> {
    try {
      const customer = await this.customerRepository.findOne({ where: { id } });
      if (!customer) {
        return genenateReturnObject(404, {}, 'Customer not found.');
      }
      await this.customerRepository.update(id, {
        updatedBy: request['user'].sub,
      });
      await this.customerRepository.update(id, updateCustomerDto);
      return await this.findOne(id);
    } catch (e) {
      return genenateReturnObject(e.statusCode, {}, (e as Error).message);
    }
  }

  async remove(id: number, request: Request): Promise<object> {
    try {
      const customer = await this.customerRepository.findOneBy({
        id: id,
        deletedAt: null,
      });
      if (!customer) {
        return genenateReturnObject(404, {}, 'Customer not found');
      }
      await this.customerRepository.update(id, {
        deletedBy: request['user'].sub,
      });
      await this.customerRepository
        .createQueryBuilder()
        .softDelete()
        .where('id = :id', { id: id })
        .execute();
      const data = await this.customerRepository.find({
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
      const customer = await this.customerRepository.findOne({
        where: {
          id: id,
          deletedAt: Not(IsNull()),
        },
        withDeleted: true,
      });
      if (!customer) {
        return genenateReturnObject(404, {}, 'Customer not found');
      }
      await this.customerRepository.update(id, {
        updatedBy: request['user'].sub,
      });
      await this.customerRepository
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
