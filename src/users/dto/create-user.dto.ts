import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsNumberString,
  IsEnum,
  IsOptional,
} from 'class-validator';
import { UserRole } from '../entities/user.entity';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  readonly username;

  @IsString()
  @IsNotEmpty()
  readonly password;

  @IsEmail()
  @IsNotEmpty()
  readonly email;

  @IsOptional()
  @IsNumberString()
  readonly phoneNumber;

  @IsOptional()
  @IsEnum(UserRole)
  readonly role;
}
