import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Request } from 'express';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { ApiDocument } from '../../decorators/document.decorator';

@Controller('customers')
@ApiTags('Customer')
@ApiBearerAuth('JWT-auth')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Post()
  @ApiDocument('Create new customer.', 'Customer created.')
  create(
    @Body() createCustomerDto: CreateCustomerDto,
    @Req() request: Request,
  ) {
    return this.customersService.create(createCustomerDto, request);
  }

  @Get()
  @ApiDocument('Get all customers.', 'List customers.')
  findAll() {
    return this.customersService.findAll();
  }

  @Get(':id')
  @ApiDocument('Get customer by id.', 'Customer information.')
  findOne(@Param('id') id: string) {
    return this.customersService.findOne(+id);
  }

  @Patch(':id')
  @ApiDocument('Update customer by id.', 'Customer information updated.')
  update(
    @Param('id') id: string,
    @Body() updateCustomerDto: UpdateCustomerDto,
    @Req() request: Request,
  ) {
    return this.customersService.update(+id, updateCustomerDto, request);
  }

  @Delete(':id')
  @ApiDocument('Delete customer by id.', 'Customer marked as deleted.')
  remove(@Param('id') id: string, @Req() request: Request) {
    return this.customersService.remove(+id, request);
  }
}
