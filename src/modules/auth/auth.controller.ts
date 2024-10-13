import {
  Body,
  Controller,
  Post,
  Request,
  UseGuards,
  Get,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { Public } from '../../decorators/public.decorator';
import { UserLoginDto } from './dto/user-login.dto';
import { ApiDocument } from '../../decorators/document.decorator';
import { genenateReturnObject } from '../../constants/return-object';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiDocument('Login with user account.', 'User info with access token')
  @Public()
  @Post('login')
  login(@Body() loginDto: UserLoginDto) {
    return this.authService.login(loginDto.userName, loginDto.password);
  }

  @UseGuards(AuthGuard)
  @ApiDocument('Get user info attach on request.', 'current user info')
  @ApiBearerAuth('JWT-auth')
  @Get('profile')
  getProfile(@Request() req) {
    return genenateReturnObject(200, { infor: req.user });
  }
}
