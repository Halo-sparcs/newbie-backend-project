import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { Posts, Log } from '@prisma/client';
import { createPostDto, updatePostDto } from './post.dto';

@Injectable()
export class PostRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createPost(user_id: number, data: createPostDto): Promise<Posts> {
    return this.prisma.posts.create({
      data: {
        ownerId: user_id,
        title: data.title,
        content: data.content,
        amount: data.amount,
        image: data.image,
      },
    });
  }

  async updatePost(id: number, data: updatePostDto): Promise<Posts> {
    return this.prisma.posts.update({
      where: { id },
      data: {
        title: data.title,
        content: data.content,
        amount: data.amount,
      },
    });
  }

  async deletePost(id: number): Promise<Posts> {
    return this.prisma.posts.delete({
      where: { id },
    });
  }

  async getById(id: number) {
    const post = await this.prisma.posts.findUnique({
      where: { id },
      include: {
        logs: true,
      },
    });
    const emptyLog: Log[] = [];

    return {
      ...post,
      logs: post.logs || emptyLog,
    };
  }

  async getByString(page: number, content: string) {
    const skip = (page - 1) * 9;
    return this.prisma.posts.findMany({
      skip: skip,
      take: 9,
      where: {
        title: {
          contains: content,
        },
      },
      orderBy: {
        id: 'asc',
      },
    });
  }
}
