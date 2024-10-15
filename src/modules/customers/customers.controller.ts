import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Req,
  DefaultValuePipe,
  ParseIntPipe,
  Query,
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
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
  ) {
    limit = limit > 100 ? 100 : limit;
    return this.customersService.findAll({ page, limit });
  }

  @Get(':id')
  @ApiDocument('Get customer by id.', 'Customer information.')
  findOne(@Param('id') id: string) {
    return this.customersService.findOne(+id);
  }

  @Post(':id')
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

  @Post('restore/:id')
  @ApiDocument('Restore customer from softdelete.', 'Customer information')
  restore(@Param('id') id: string, @Req() request: Request) {
    return this.customersService.restore(+id, request);
  }
}
