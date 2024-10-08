import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateInventoryDto {
  @IsNumber()
  @IsNotEmpty()
  quantity;

  @IsNumber()
  @IsNotEmpty()
  productId;
}
