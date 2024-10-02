import {
  IsString,
  IsOptional,
  IsNumberString,
  IsBoolean,
} from 'class-validator';

export class UpdateProductDto {
  @IsOptional()
  @IsString()
  readonly name;

  @IsOptional()
  @IsString()
  readonly description;

  @IsOptional()
  @IsNumberString()
  readonly price;

  @IsOptional()
  @IsBoolean()
  readonly isDelete;
}
