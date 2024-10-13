import { IsNotEmpty, IsNumber } from 'class-validator';
import { CreateProductDto } from '../../product/dto/create-product.dto';

export class CreateInventoryDto extends CreateProductDto {
  @IsNumber()
  @IsNotEmpty()
  quantity;
}
