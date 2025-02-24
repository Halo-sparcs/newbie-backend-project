import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { createReturnDto } from './return.dto';
import { Return } from '@prisma/client';

@Injectable()
export class ReturnRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createReturn(borrower_id: number, dto: createReturnDto): Promise<Return> {
    let { log_id, owner_id } = dto;
    log_id = Number(log_id);
    owner_id = Number(owner_id);
    return this.prisma.return.create({
      data: {
        borrower_id,
        log_id,
        owner_id,
      },
    });
  }

  async deleteReturn(id: number): Promise<Return> {
    const ret = await this.prisma.return.findUnique({
      where: { id },
    });

    const log = await this.prisma.log.findUnique({
      where: {
        id: ret.log_id,
      },
    });

    const post = await this.prisma.posts.findUnique({
      where: {
        id: log.post_id,
      },
    });
    post.amount += log.amount;

    await this.prisma.posts.update({
      where: {
        id: log.post_id,
      },
      data: {
        amount: post.amount,
      },
    });

    return this.prisma.return.delete({
      where: { id },
    });
  }

  async getByOwnerId(last_id: number, ownerId: number): Promise<Return[]> {
    return this.prisma.return.findMany({
      where: {
        owner_id: ownerId,
        id: {
          gt: last_id,
        },
      },
      take: 9,
      orderBy: {
        id: 'asc',
      },
    });
  }

  async getById(id: number): Promise<Return> {
    return this.prisma.return.findUnique({
      where: { id },
    });
  }
}
