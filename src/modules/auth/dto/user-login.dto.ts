import { IsString, IsNotEmpty } from 'class-validator';

export class UserLoginDto {
  @IsNotEmpty()
  @IsString()
  readonly username!: string;

  @IsNotEmpty()
  @IsString()
  readonly password!: string;
}
