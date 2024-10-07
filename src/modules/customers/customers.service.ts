import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { Repository } from 'typeorm';
import { Customer } from './entities/customer.entity';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
  ) {}

  async create(
    createCustomerDto: CreateCustomerDto,
    request: Request,
  ): Promise<Customer> {
    const customer = new Customer();

    customer.name = createCustomerDto.name;
    customer.address = createCustomerDto.address;
    customer.phoneNumber = createCustomerDto.phoneNumber;
    customer.email = createCustomerDto.email;

    customer.createBy = request['user'].sub;
    customer.updateBy = request['user'].sub;
    customer.createAt = new Date();
    customer.updateAt = new Date();
    return await this.customerRepository.save(customer);
  }

  async findAll(): Promise<Customer[]> {
    return await this.customerRepository.find();
  }

  async findOne(id: number): Promise<Customer> {
    return await this.customerRepository.findOne({ where: { id } });
  }

  async update(
    id: number,
    updateCustomerDto: UpdateCustomerDto,
    request: Request,
  ): Promise<void> {
    if (!(await this.findOne(id))) {
      throw new NotFoundException('Customer not found.');
    }

    if (updateCustomerDto.isDelete) {
      updateCustomerDto.isDelete =
        updateCustomerDto.isDelete === 'false' ? false : true;
    }

    await this.customerRepository.update(id, updateCustomerDto);
    await this.customerRepository.update(id, {
      updateBy: request['user'].sub,
      updateAt: new Date(),
    });
  }

  async remove(id: number, request: Request): Promise<void> {
    const updateCustomerDto = {
      isDelete: true,
      deleteBy: request['user'].sub,
      deletedAt: new Date(),
    };

    this.update(id, updateCustomerDto, request);
  }
}
