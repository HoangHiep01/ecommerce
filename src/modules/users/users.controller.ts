import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  DefaultValuePipe,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
// import { UpdateUserDto } from './dto/update-user.dto';
import { Public } from '../../decorators/public.decorator';
import { Role } from '../../decorators/role.decorator';
import { UserRole } from '../../constants/user-role-type';
import { ApiDocument } from '../../decorators/document.decorator';

@ApiTags('User')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Public()
  @Post('signup')
  @ApiDocument(
    'Register user account.',
    'User information successfully registered.',
  )
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  @ApiDocument('Get list user account.', 'List user account.')
  @ApiBearerAuth('JWT-auth')
  @Role(UserRole.OWNER)
  @Get()
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
  ) {
    limit = limit > 100 ? 100 : limit;
    return this.usersService.findAll({ page, limit });
  }

  @ApiBearerAuth('JWT-auth')
  @ApiDocument('Get one user account.', 'User account.')
  @Role(UserRole.OWNER)
  @Get(':username')
  findOne(@Param('username') userName: string) {
    return this.usersService.findOneByUserName(userName);
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
