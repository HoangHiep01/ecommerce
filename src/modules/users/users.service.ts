import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Equal } from 'typeorm';
import { paginate, IPaginationOptions } from 'nestjs-typeorm-paginate';
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
    private logger: Logger,
  ) {}

  SERVICE: string = UsersService.name;

  async createUser(createUserDto: CreateUserDto): Promise<object> {
    try {
      const user = new User();
      const isUserNameExist = await this.findOneByUserName(
        createUserDto.userName,
      );
      const isEmailExist = await this.findOneByEmail(createUserDto.email);

      if (
        isUserNameExist['statusCode'] == 200 ||
        isEmailExist['statusCode'] == 200
      ) {
        this.logger.log(
          'Unable to create user cause unique constraint',
          this.SERVICE,
        );
        return genenateReturnObject(
          409,
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

      this.logger.log(`User created successfully ${data.id}`);
      return genenateReturnObject(200, data);
    } catch (error) {
      this.logger.error('Unable to create user', error.stack, this.SERVICE);
      return genenateReturnObject(error.statusCode, {}, error.message);
    }
  }

  async findAll(options: IPaginationOptions): Promise<object> {
    try {
      const query = this.usersRepository.createQueryBuilder('users');
      const data = await paginate<User>(query, options);
      this.logger.log('List users fetched successfully', this.SERVICE);
      return genenateReturnObject(200, data);
    } catch (error) {
      this.logger.error(
        'Unable to fetch list users',
        error.stack,
        this.SERVICE,
      );
      return genenateReturnObject(error.statusCode, {}, error.message);
    }
  }

  async findOneByUserName(userName: string): Promise<object> {
    try {
      const user = await this.usersRepository.findOne({
        where: {
          userName: Equal(userName),
        },
      });
      if (!user) {
        this.logger.log(`Unable to find user with ${userName}`, this.SERVICE);
        return genenateReturnObject(404, {}, 'User not found');
      }
      this.logger.log(`User ${userName} fetch successfully`, this.SERVICE);
      return genenateReturnObject(200, user);
    } catch (error) {
      this.logger.error('Unable to fetch user', error.stack, this.SERVICE);
      return genenateReturnObject(error.statusCode, {}, error.message);
    }
  }

  async findOneByEmail(email: string): Promise<object> {
    try {
      const user = await this.usersRepository.findOne({
        where: {
          email: Equal(email),
        },
      });
      if (!user) {
        this.logger.log(`Unable to find user with ${email}`, this.SERVICE);
        return genenateReturnObject(404, {}, 'User not found');
      }
      this.logger.log(`User ${email} fetch successfully`, this.SERVICE);
      return genenateReturnObject(200, user);
    } catch (error) {
      this.logger.error('Unable to fetch user', error.stack, this.SERVICE);
      return genenateReturnObject(error.statusCode, {}, error.message);
    }
  }

  async findPasswordByUserName(userName: string): Promise<object> {
    try {
      const userPassword = await this.usersRepository
        .createQueryBuilder('users')
        .select('users.userName', 'userName')
        .addSelect('users.password')
        .where('users.userName = :userName', { userName: userName })
        .getOne();
      if (!userPassword) {
        this.logger.log(
          `Unable to find user password by ${userName}`,
          this.SERVICE,
        );
        return genenateReturnObject(404, {}, 'Can not found password');
      }
      this.logger.log(`User password fetch successfully`, this.SERVICE);
      return genenateReturnObject(200, userPassword);
    } catch (error) {
      this.logger.error(
        'Unable to fetch user password',
        error.stack,
        this.SERVICE,
      );
      return genenateReturnObject(error.statusCode, {}, error.message);
    }
  }

  // update(id: number, updateUserDto: UpdateUserDto) {
  //   return `This action updates a #${id} user`;
  // }

  // async remove(id: number): Promise<void> {
  //   await this.usersRepository.delete(id);
  // }
}
