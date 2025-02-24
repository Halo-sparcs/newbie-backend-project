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
        owner_id: createLogDto.owner_id,
      },
      include: {
        post: true,
      },
    });
  }

  async updateLog(id: number): Promise<Log> {
    return this.prisma.log.update({
      where: { id },
      data: {
        returned_at: new Date(),
      },
    });
  }

  async getById(id: number): Promise<Log> {
    return this.prisma.log.findUnique({
      where: { id },
    });
  }

  async getByBorrowerId(last_id: number, id: number): Promise<Log[]> {
    return this.prisma.log.findMany({
      where: {
        id: {
          gt: last_id,
        },
        borrower_id: id,
        returned_at: null,
      },
      take: 9,
      orderBy: {
        borrowed_at: 'asc',
      },
    });
  }

  async getByPostId(postId: number): Promise<Log[]> {
    return this.prisma.log.findMany({
      where: {
        post_id: postId,
        returned_at: null,
      },
    });
  }

  async getAll() {
    return this.prisma.log.findMany();
  }

  // async getByOwnerId(
  //   id: number,
  // ): Promise<{ postId: number; notReturned: boolean }[]> {
  //   const posts = await this.prisma.posts.findMany({
  //     where: {
  //       ownerId: id,
  //     },
  //     include: {
  //       logs: true,
  //     },
  //   });
  //
  //   return posts
  //     .map((post) => {
  //       const lentLog = post.logs.find((log) => log.returned_at === null);
  //       return {
  //         postId: post.id,
  //         notReturned: !!lentLog,
  //       };
  //     })
  //     .filter((post) => post.notReturned);
  // }

  // async getById(id: number) {
  //   return this.prisma.log.findUnique({
  //     where: {
  //       id: id,
  //     },
  //   });
  // }
}
