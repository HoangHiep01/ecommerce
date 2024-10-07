import { IsString, IsNotEmpty, IsNumberString, IsEmail } from 'class-validator';

export class CreateCustomerDto {
  @IsNotEmpty()
  @IsString()
  readonly name;

  @IsNotEmpty()
  @IsString()
  readonly address;

  @IsNotEmpty()
  @IsEmail()
  readonly email;

  @IsNotEmpty()
  @IsNumberString()
  readonly phoneNumber;
}
