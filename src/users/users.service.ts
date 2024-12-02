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
    return this.UsersRepository.getAll();
  }

  async createUser(user: userDto) {
    const hashed_pwd: string = await bcrypt.hash(user.user_pwd, 10);
    console.log(hashed_pwd);
    return this.UsersRepository.createUser({
      user_id: user.user_id,
      user_pwd: hashed_pwd,
      contact: user.contact,
      place: user.place,
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
