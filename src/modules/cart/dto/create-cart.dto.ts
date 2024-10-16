import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateCartDto {
  @IsNumber()
  @IsNotEmpty()
  customerId;
}
