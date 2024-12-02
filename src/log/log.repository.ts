import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { Log } from '@prisma/client';
import { createLogDto } from './log.dto';

@Injectable()
export class LogRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createLog(createLogDto: createLogDto): Promise<Log> {
    return this.prisma.log.create({
      data: {
        post_id: createLogDto.post_id,
        amount: createLogDto.amount,
        borrower_id: createLogDto.borrower_id,
      },
      include: {
        post: true,
      },
    });
  }

  /*
  I don't think we'll delete Logs for it (in case of calling cops)
  async deleteLog(id: number) {
    return this.prisma.posts.delete({
      where: { id },
    });
  }
  */

  async getByBorrowerId(id: number): Promise<Log[]> {
    return this.prisma.log.findMany({
      where: {
        borrower_id: id,
      },
    });
  }

  async getByOwnerId(
    id: number,
  ): Promise<{ postId: number; notReturned: boolean }[]> {
    const posts = await this.prisma.posts.findMany({
      where: {
        ownerId: id,
      },
      include: {
        logs: true,
      },
    });

    return posts
      .map((post) => {
        const lentLog = post.logs.find((log) => log.returned_at === null);
        return {
          postId: post.id,
          notReturned: !!lentLog,
        };
      })
      .filter((post) => post.notReturned);
  }

  async getById(id: number) {
    return this.prisma.log.findUnique({
      where: {
        id: id,
      },
    });
  }

  async return(id: number) {
    return this.prisma.log.update({
      where: {
        id: id,
      },
      data: {
        returned_at: new Date(),
      },
    });
  }
}
