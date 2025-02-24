import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Users } from '@prisma/client';
import { createUserDto } from './users.dto';

@Injectable()
export class UsersRepository {
  constructor(private prisma: PrismaService) {}

  async getById(id: number): Promise<Users | null> {
    return this.prisma.users.findUnique({
      where: {
        id: id,
      },
    });
  }

  async getAll() {
    return this.prisma.users.findMany();
  }

  async getByName(name: string): Promise<Users | null> {
    return this.prisma.users.findUnique({
      where: {
        username: name,
      },
    });
  }

  async getByUserId(user_id: string) {
    return this.prisma.users.findUnique({
      where: {
        user_id: user_id,
      },
    });
  }

  async createUser(createUserDto: createUserDto) {
    return this.prisma.users.create({
      data: {
        user_id: createUserDto.user_id,
        user_pwd: createUserDto.user_pwd,
        username: createUserDto.username,
        contact: createUserDto.contact,
      },
    });
  }

  async updateUser(id: number, data: createUserDto) {
    return this.prisma.users.update({
      where: {
        id: Number(id),
      },
      data: {
        user_id: data.user_id,
        username: data.username,
        contact: data.contact,
      }
    });
  }

  async deleteUser(id: number) {
    return this.prisma.users.delete({
      where: {
        id: id,
      },
    });
  }

  async updateUserRefreshToken(id: number, refreshToken: string) {
    console.log(refreshToken);
    return this.prisma.users.update({
      where: {
        id: id,
      },
      data: {
        refreshToken: refreshToken,
      },
    });
  }
}
