import {
  IsString,
  IsOptional,
  IsNumberString,
  IsBoolean,
} from 'class-validator';
import { Transform } from 'class-transformer';

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
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  isDelete;
}
