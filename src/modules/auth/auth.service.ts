import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcryptjs from 'bcryptjs';
import { genenateReturnObject } from '../../constants/return-object';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private logger: Logger,
  ) {}

  SERVICE: string = AuthService.name;

  async login(userName: string, password: string): Promise<object> {
    try {
      const result = await this.usersService.findOneByUserName(userName);
      const user = result['data'];
      if (result['statusCode'] != 200) {
        return result;
      }

      // return object User contain password
      const userPin = await this.usersService.findPasswordByUserName(userName);
      const hashPassword = userPin['data'].password;
      const isMatch = await bcryptjs.compare(password, hashPassword);

      if (!isMatch) {
        this.logger.log(
          `User login failed because password is not match`,
          this.SERVICE,
        );
        return genenateReturnObject(401, {}, 'Password is incorrect');
      }
      const payload = { sub: user.id, userName: user.userName };
      this.logger.log(`User ${user.userName} login successfully`, this.SERVICE);
      return genenateReturnObject(200, {
        accessToken: await this.jwtService.signAsync(payload),
      });
    } catch (error) {
      this.logger.error('Unable to login', error.stack, this.SERVICE);
      return genenateReturnObject(error.statusCode, {}, error.message);
    }
  }
}
