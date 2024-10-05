import { IsString, IsNotEmpty, IsNumberString } from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  readonly name;

  @IsNotEmpty()
  @IsString()
  readonly description;

  @IsNotEmpty()
  @IsNumberString()
  readonly price;
}
