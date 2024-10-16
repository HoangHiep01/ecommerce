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
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiDocument } from '../../decorators/document.decorator';

@Controller('product')
@ApiTags('Product')
@ApiBearerAuth('JWT-auth')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @ApiDocument('Create new product.', 'Product created.')
  create(@Body() createProductDto: CreateProductDto, @Req() request: Request) {
    return this.productService.create(createProductDto, request);
  }

  @Get()
  @ApiDocument('Get all products.', 'List products.')
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
  ) {
    limit = limit > 100 ? 100 : limit;
    return this.productService.findAll({ page, limit });
  }

  @Get('search/:context')
  @ApiDocument('Search products.', 'List products suit with context.')
  async index(
    @Param('context') context: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
  ) {
    limit = limit > 100 ? 100 : limit;
    return this.productService.searchProductPaginate(context, { page, limit });
  }

  @Get(':id')
  @ApiDocument('Get product with id', 'Product information.')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(+id);
  }

  @Post(':id')
  @ApiDocument('Update product with id', 'Product updated.')
  update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @Req() request: Request,
  ) {
    return this.productService.update(+id, updateProductDto, request);
  }

  @Delete(':id')
  @ApiDocument(
    'Soft delete product with id (mark as deleted)',
    'Product has been deleted.',
  )
  remove(@Param('id') id: string, @Req() request: Request) {
    return this.productService.remove(+id, request);
  }

  @Post('restore/:id')
  @ApiDocument('Restore product from softdelete.', 'Product information')
  restore(@Param('id') id: string, @Req() request: Request) {
    return this.productService.restore(+id, request);
  }
}
