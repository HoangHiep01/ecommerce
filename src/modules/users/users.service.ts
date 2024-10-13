import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  paginate,
  Pagination,
  IPaginationOptions,
} from 'nestjs-typeorm-paginate';
import { CreateUserDto } from './dto/create-user.dto';
// import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import * as bcryptjs from 'bcryptjs';
import { genenateReturnObject } from '../../constants/return-object';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<object> {
    try {
      const user = new User();
      const isUserNameExist = await this.findOneByUserName(
        createUserDto.userName,
      );
      const isEmailExist = await this.findOneByEmail(createUserDto.email);

      if (isUserNameExist || isEmailExist) {
        return genenateReturnObject(
          400,
          {},
          'Username or email already taken.',
        );
      }

      user.userName = createUserDto.userName;
      user.email = createUserDto.email;
      if (createUserDto.phoneNumber) {
        user.phoneNumber = createUserDto.phoneNumber;
      }
      if (createUserDto.role) {
        user.role = createUserDto.role;
      }
      // hash password
      user.password = await bcryptjs.hash(createUserDto.password, 10);

      const data = await this.usersRepository.save(user);
      delete data.password;

      return genenateReturnObject(200, data);
    } catch (e) {
      return genenateReturnObject(400, {}, (e as Error).message);
    }
  }

  async findAll(options: IPaginationOptions): Promise<Pagination<User>> {
    const query = this.usersRepository.createQueryBuilder('users');
    return paginate<User>(query, options);
  }

  async findOneByUserName(userName: string): Promise<User | undefined> {
    try {
      return this.usersRepository.findOneBy({ userName });
    } catch (e) {
      console.log(e);
      return undefined;
    }
  }

  async findOneByEmail(email: string): Promise<User | undefined> {
    try {
      return this.usersRepository.findOneBy({ email });
    } catch (e) {
      console.log(e);
      return undefined;
    }
  }

  async findPasswordByUserName(userName: string): Promise<User | undefined> {
    try {
      return await this.usersRepository
        .createQueryBuilder('users')
        .select('users.userName', 'userName')
        .addSelect('users.password')
        .where('users.userName = :userName', { userName: userName })
        .getOne();
    } catch (e) {
      console.log(e);
      return undefined;
    }
  }

  // update(id: number, updateUserDto: UpdateUserDto) {
  //   return `This action updates a #${id} user`;
  // }

  // async remove(id: number): Promise<void> {
  //   await this.usersRepository.delete(id);
  // }
}
