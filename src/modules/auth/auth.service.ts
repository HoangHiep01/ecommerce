import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcryptjs from 'bcryptjs';
import { genenateReturnObject } from '../../constants/return-object';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(userName: string, password: string): Promise<object> {
    try {
      const user = await this.usersService.findOneByUserName(userName);
      if (!user) {
        throw new BadRequestException('Account is not found.');
      }

      // return object User contain password
      const userPin = await this.usersService.findPasswordByUserName(userName);
      const isMatch = await bcryptjs.compare(password, userPin.password);

      if (!isMatch) {
        throw new UnauthorizedException('Password is incorrect.');
      }
      const payload = { sub: user.id, userName: user.userName };
      return genenateReturnObject(200, {
        accessToken: await this.jwtService.signAsync(payload),
      });
    } catch (e) {
      return genenateReturnObject(400, {}, (e as Error).message);
    }
  }
}
