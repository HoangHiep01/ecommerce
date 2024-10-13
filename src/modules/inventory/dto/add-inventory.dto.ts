import { IsNotEmpty, IsNumber } from 'class-validator';

export class AddInventoryDto {
  @IsNumber()
  @IsNotEmpty()
  quantity;

  @IsNumber()
  @IsNotEmpty()
  productId;
}
