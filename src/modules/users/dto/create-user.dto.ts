import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsNumberString,
  IsEnum,
  IsOptional,
} from 'class-validator';
import { UserRole } from '../../../constants/user-role-type';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  readonly userName;

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
