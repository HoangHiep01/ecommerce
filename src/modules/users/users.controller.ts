import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
// import { UpdateUserDto } from './dto/update-user.dto';
import { Public } from '../../decorators/public.decorator';
import { Role } from '../../decorators/role.decorator';
import { UserRole } from '../../constants/user-role-type';
import { ApiDocument } from '../../decorators/document.decorator';

@Controller('users')
@ApiTags('User')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Public()
  @Post('signup')
  @ApiDocument(
    'Register user account.',
    'User information successfully registered.',
  )
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Role(UserRole.OWNER)
  @ApiDocument('Get list user account.', 'List user account.')
  @ApiBearerAuth('JWT-auth')
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':username')
  @ApiDocument('Get one user account.', 'User account.')
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
