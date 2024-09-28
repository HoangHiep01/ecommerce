import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsNumberString,
  IsEnum,
} from 'class-validator';
import { UserRole } from '../entities/user.entity';

// define users DTO

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
  readonly phoneNumber;

  @IsEnum(UserRole)
  readonly role;
}
