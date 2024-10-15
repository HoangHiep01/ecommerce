import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { Repository, IsNull, Not, Equal } from 'typeorm';
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
    private readonly logger: Logger,
  ) {}

  SERVICE: string = CustomersService.name;

  async isCustomerFieldsRecordExist(
    email: string,
    phoneNumber: string,
  ): Promise<boolean> {
    const result = await this.customerRepository.find({
      where: [{ email: Equal(email) }, { phoneNumber: Equal(phoneNumber) }],
    });
    return result.length > 0;
  }

  async create(
    createCustomerDto: CreateCustomerDto,
    request: Request,
  ): Promise<object> {
    try {
      const isRecordExist = await this.isCustomerFieldsRecordExist(
        createCustomerDto.email,
        createCustomerDto.phoneNumber,
      );
      if (isRecordExist) {
        this.logger.log(
          'Unable to create customer cause unique constraint',
          this.SERVICE,
        );
        return genenateReturnObject(
          409,
          {},
          'Email or phonenumber already exist',
        );
      }

      const customer = new Customer();
      customer.name = createCustomerDto.name;
      customer.address = createCustomerDto.address;
      customer.phoneNumber = createCustomerDto.phoneNumber;
      customer.email = createCustomerDto.email;

      customer.createdBy = request['user'].sub;
      customer.updatedBy = request['user'].sub;

      const data = await this.customerRepository.save(customer);
      this.logger.log(`Customer created successfully ${data.id}`, this.SERVICE);
      return genenateReturnObject(200, data);
    } catch (error) {
      this.logger.error('Unable to create customer', error.stack, this.SERVICE);
      return genenateReturnObject(error.statusCode, {}, error.message);
    }
  }

  async findAll(options: IPaginationOptions): Promise<object> {
    try {
      const query = this.customerRepository.createQueryBuilder();
      const data = await paginate<Customer>(query, options);
      this.logger.log(`List customers fetched successfully`, this.SERVICE);
      return genenateReturnObject(200, data);
    } catch (error) {
      this.logger.error(
        'Unable to fetch list customers',
        error.stack,
        this.SERVICE,
      );
      return genenateReturnObject(error.statusCode, {}, error.message);
    }
  }

  async findOne(id: number): Promise<object> {
    try {
      const customer = await this.customerRepository.findOne({
        where: {
          id: Equal(id),
        },
      });
      if (!customer) {
        this.logger.log(`Customer not found ${id}`, this.SERVICE);
        return genenateReturnObject(404, {}, 'Customer not found');
      }
      this.logger.log(`Customer fetched successfully ${id}`, this.SERVICE);
      return genenateReturnObject(200, customer);
    } catch (error) {
      this.logger.error('Unable to fetch customer', error.stack, this.SERVICE);
      return genenateReturnObject(error.statusCode, {}, error.message);
    }
  }

  async update(
    id: number,
    updateCustomerDto: UpdateCustomerDto,
    request: Request,
  ): Promise<object> {
    try {
      const isRecordExist = await this.isCustomerFieldsRecordExist(
        updateCustomerDto.email,
        updateCustomerDto.phoneNumber,
      );
      if (isRecordExist) {
        this.logger.log(
          'Unable to update customer cause unique constraint',
          this.SERVICE,
        );
        return genenateReturnObject(
          409,
          {},
          'Email or phonenumber already exist',
        );
      }

      const customer = await this.findOne(id);
      if (customer['statusCode'] != 200) {
        this.logger.log(
          'Unable to update customer because customer not found',
          this.SERVICE,
        );
        return genenateReturnObject(
          409,
          {},
          'Email or phonenumber already exist',
        );
        return genenateReturnObject(404, {}, 'Customer not found');
      }
      await this.customerRepository.update(id, {
        updatedBy: request['user'].sub,
      });
      await this.customerRepository.update(id, updateCustomerDto);
      this.logger.log(`Customer updated successfully ${id}`, this.SERVICE);
      return await this.findOne(id);
    } catch (error) {
      this.logger.error('Unable to update customer', error.stack, this.SERVICE);
      return genenateReturnObject(error.statusCode, {}, error.message);
    }
  }

  async remove(id: number, request: Request): Promise<object> {
    try {
      const customer = await this.findOne(id);
      if (customer['statusCode'] != 200) {
        this.logger.log(
          'Unable to remove customer because customer not found',
          this.SERVICE,
        );
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
      this.logger.log(`Customer deleted successfully ${id}`, this.SERVICE);
      return genenateReturnObject(200, data);
    } catch (error) {
      this.logger.error('Unable to delete customer', error.stack, this.SERVICE);
      return genenateReturnObject(error.statusCode, {}, error.message);
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
        this.logger.log(
          `Customer marked as deleted not found ${id}`,
          this.SERVICE,
        );
        return genenateReturnObject(
          404,
          {},
          'Customer marked as deleted not found',
        );
      }
      await this.customerRepository.update(id, {
        updatedBy: request['user'].sub,
      });
      await this.customerRepository
        .createQueryBuilder()
        .restore()
        .where('id = :id', { id: id })
        .execute();

      this.logger.log(`Customer restored successfully ${id}`, this.SERVICE);
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
}
