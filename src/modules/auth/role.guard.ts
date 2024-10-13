import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { ROLES_KEY } from '../../decorators/role.decorator';
import { UserRole } from '../../constants/user-role-type';
import { UsersService } from '../users/users.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
    private usersService: UsersService,
    private configSrvice: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredRoles) {
      return true;
    }
    // take token from header -> user infor -> Do user have role required?
    // what if user dont have token and try username/password.
    // Not finished yet?
    const request = context.switchToHttp().getRequest();

    const userName = request['user'].userName;
    const user = await this.usersService.findOneByUserName(userName);
    // console.log(userName);
    // console.log(user);
    return requiredRoles === user.role;
  }

  async verifyTokenAsync(request: Request): Promise<boolean> {
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      return false;
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configSrvice.get<string>('secret'),
      });
      // 💡 We're assigning the payload to the request object here
      // so that we can access it in our route handlers
      // console.log(request['user']);
      request['user'] = payload;
    } catch {}
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
