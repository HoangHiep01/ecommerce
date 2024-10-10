import { IsNotEmpty, IsNumber } from 'class-validator';

export class AddItemDto {
  @IsNumber()
  @IsNotEmpty()
  quantity;

  @IsNumber()
  @IsNotEmpty()
  inventoryId;
}
