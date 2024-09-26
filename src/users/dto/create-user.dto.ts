import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsNumberString,
  IsEnum,
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

  @IsNumberString()
  @IsNotEmpty()
  readonly phonenumber;

  @IsEnum(UserRole)
  readonly role;
}
