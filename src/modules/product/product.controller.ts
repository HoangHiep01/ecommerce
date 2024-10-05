import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  DefaultValuePipe,
  ParseIntPipe,
  Query,
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
import { Pagination } from 'nestjs-typeorm-paginate';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';

@Controller('product')
@ApiTags('Product')
@ApiBearerAuth('JWT-auth')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Create new product.' })
  @ApiOkResponse({ description: 'Product created.' })
  create(@Body() createProductDto: CreateProductDto, @Req() request: Request) {
    return this.productService.create(createProductDto, request);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all products.' })
  @ApiOkResponse({ description: 'List products.' })
  findAll() {
    return this.productService.findAll();
  }

  @Get('search/:context')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Search products.' })
  @ApiOkResponse({ description: 'List products suit with context.' })
  async index(
    @Param('context') context: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
  ): Promise<Pagination<Product>> {
    limit = limit > 100 ? 100 : limit;
    return this.productService.searchProductPaginate(context, { page, limit });
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get product with id' })
  @ApiOkResponse({ description: 'Product information.' })
  findOne(@Param('id') id: string) {
    return this.productService.findOne(+id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update product with id' })
  @ApiOkResponse({ description: 'Product updated.' })
  update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @Req() request: Request,
  ) {
    return this.productService.update(+id, updateProductDto, request);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Soft delete product with id (mark as deleted)' })
  @ApiOkResponse({ description: 'Product has been deleted.' })
  remove(@Param('id') id: string, @Req() request: Request) {
    return this.productService.remove(+id, request);
  }
}
