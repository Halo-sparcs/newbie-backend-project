import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { createBorrowDto } from './borrow.dto';
import { Borrow } from '@prisma/client';

@Injectable()
export class BorrowRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createBorrow(borrower_id: number, dto: createBorrowDto): Promise<Borrow> {
    const { post_id, owner_id, amount } = dto;
    return this.prisma.borrow.create({
      data: {
        borrower_id,
        post_id,
        owner_id,
        amount,
      },
    });
  }

  async deleteBorrow(post_id: number, id: number) {
    const post = await this.prisma.posts.findUnique({
      where: {
        id: post_id,
      },
    });
    const borrowRequest = await this.prisma.borrow.findUnique({
      where: { id },
    });

    post.amount -= borrowRequest.amount;

    if (post.amount < 0) {
      throw new ForbiddenException("Requested amount is bigger than you got");
    }

    await this.prisma.posts.update({
      where: {
        id: post_id,
      },
      data: {
        amount: post.amount,
      },
    });

    return this.prisma.borrow.delete({
      where: { id },
    });
  }

  async deleteByPostId(postId: number) {
    return this.prisma.borrow.deleteMany({
      where: {
        post_id: postId,
      },
    });
  }

  async getByBorrower(last_id: number, borrower_id: number): Promise<Borrow[]> {
    return this.prisma.borrow.findMany({
      where: {
        id: {
          gt: last_id,
        },
        borrower_id: borrower_id,
      },
      take: 9,
      orderBy: {
        apply_at: 'asc',
      },
    });
  }

  async getByOwnerId(last_id: number, owner_id: number): Promise<Borrow[]> {
    return this.prisma.borrow.findMany({
      where: {
        id: {
          gt: last_id,
        },
        owner_id: owner_id,
      },
      take: 9,
      orderBy: {
        apply_at: 'asc',
      },
    });
  }

  async getById(id: number): Promise<Borrow> {
    return this.prisma.borrow.findUnique({
      where: { id },
    });
  }
}
