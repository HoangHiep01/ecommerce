import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOkResponse,
  ApiOperation,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Request } from 'express';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Controller('customers')
@ApiTags('Customer')
@ApiBearerAuth('JWT-auth')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Create new customer.' })
  @ApiOkResponse({ description: 'Customer created.' })
  create(
    @Body() createCustomerDto: CreateCustomerDto,
    @Req() request: Request,
  ) {
    return this.customersService.create(createCustomerDto, request);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all customers.' })
  @ApiOkResponse({ description: 'List customers.' })
  findAll() {
    return this.customersService.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get customer by id.' })
  @ApiOkResponse({ description: 'Customer information.' })
  findOne(@Param('id') id: string) {
    return this.customersService.findOne(+id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update customer by id.' })
  @ApiOkResponse({ description: 'Customer information updated.' })
  update(
    @Param('id') id: string,
    @Body() updateCustomerDto: UpdateCustomerDto,
    @Req() request: Request,
  ) {
    return this.customersService.update(+id, updateCustomerDto, request);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete customer by id.' })
  @ApiOkResponse({ description: 'Customer marked as deleted.' })
  remove(@Param('id') id: string, @Req() request: Request) {
    return this.customersService.remove(+id, request);
  }
}
