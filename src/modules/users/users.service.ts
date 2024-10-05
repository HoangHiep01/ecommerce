import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
// import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import * as bcryptjs from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = new User();

    // Check username or email is exist?
    const isUsernameExist = await this.findOneByUsername(
      createUserDto.username,
    );
    const isEmailExist = await this.findOneByEmale(createUserDto.email);
    if (isUsernameExist || isEmailExist) {
      throw new BadRequestException('Username or email already taken.');
    }

    user.username = createUserDto.username;
    user.email = createUserDto.email;
    if (createUserDto.phoneNumber) {
      user.phoneNumber = createUserDto.phoneNumber;
    }
    if (createUserDto.role) {
      user.role = createUserDto.role;
    }
    // hash password
    user.password = await bcryptjs.hash(createUserDto.password, 10);

    return await this.usersRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findOneByUsername(username: string): Promise<User | undefined> {
    return this.usersRepository.findOneBy({ username });
  }

  async findOneByEmale(email: string): Promise<User | undefined> {
    return this.usersRepository.findOneBy({ email });
  }

  // update(id: number, updateUserDto: UpdateUserDto) {
  //   return `This action updates a #${id} user`;
  // }

  // async remove(id: number): Promise<void> {
  //   await this.usersRepository.delete(id);
  // }
}
