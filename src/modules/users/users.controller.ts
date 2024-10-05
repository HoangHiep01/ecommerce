import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOkResponse,
  ApiOperation,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
// import { UpdateUserDto } from './dto/update-user.dto';
import { Public } from '../../decorators/public.decorator';
import { Role } from '../../decorators/role.decorator';
import { UserRole } from '../../constants/user-role-type';

@Controller('users')
@ApiTags('User')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Public()
  @Post('signup')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Register user account.' })
  @ApiOkResponse({ description: 'User information successfully registered.' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Role(UserRole.OWNER)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get list user account.' })
  @ApiOkResponse({ description: 'List user account.' })
  @ApiBearerAuth('JWT-auth')
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':username')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get one user account.' })
  @ApiOkResponse({ description: 'User account.' })
  @ApiBearerAuth('JWT-auth')
  findOne(@Param('username') username: string) {
    return this.usersService.findOneByUsername(username);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.usersService.update(+id, updateUserDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.usersService.remove(+id);
  // }
}
