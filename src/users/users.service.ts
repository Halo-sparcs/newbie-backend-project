import { Injectable } from '@nestjs/common';
import { userDto } from './users.dto';
import { PrismaClient } from '@prisma';

const prisma = new PrismaClient();

@Injectable()
export class UsersService {
  async getById(id: string): Promise<userDto> {
    const user: userDto = await prisma.user.findUnique({
      where: {
        user_id: id,
      },
    });
    return user;
  }

  async createUser(user: userDto): Promise<boolean> {
    const res = await prisma.user.create({
      id: user.id,
      user_id: user.user_id,
      user_pwd: user.user_pwd,
      place: user.place,
      contact: user.contact
    });

    return (res === user);
  }
}
