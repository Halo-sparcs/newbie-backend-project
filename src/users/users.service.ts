import { Injectable, NotFoundException } from '@nestjs/common';
import { createUserDto, userDto } from './users.dto';
import { UsersRepository } from './users.repository';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private UsersRepository: UsersRepository) {}

  async getById(id: number) {
    const user = await this.UsersRepository.getById(id);
    return user;
  }

  async getByName(name: string) {
    const user = await this.UsersRepository.getByName(name);
    if (user === null) {
      throw new NotFoundException(`User ${name} not found.`);
    }
    user.user_id = null;
    user.user_pwd = null;
    user.refreshToken = null;
    return user;
  }

  async getByUserId(user_id: string) {
    const user = await this.UsersRepository.getByUserId(user_id);
    if (user === null) {
      throw new NotFoundException(`User not found`);
    }
    return user;
  }

  async getAll() {
    const user = await this.UsersRepository.getAll();
    if (user === null) {
      throw new NotFoundException(`User not found`);
    }
    return user;
  }

  async createUser(user: createUserDto) {
    const salt = await bcrypt.genSalt(10);
    const hashed_pwd: string = await bcrypt.hash(user.user_pwd, salt);
    console.log(hashed_pwd);
    console.log(user);
    return this.UsersRepository.createUser({
      user_id: user.user_id,
      user_pwd: hashed_pwd,
      contact: user.contact,
      username: user.username,
    });
  }

  async updateUser(id: number, info: createUserDto) {
    await this.UsersRepository.updateUser(id, info);
  }

  async deleteUser(id: number) {
    await this.UsersRepository.deleteUser(id);
  }
}
