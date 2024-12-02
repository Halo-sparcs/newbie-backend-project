import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { Posts, Log } from '@prisma/client';
import { createPostDto, updatePostDto } from './post.dto';

@Injectable()
export class PostRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createPost(data: createPostDto): Promise<Posts> {
    return this.prisma.posts.create({
      data: {
        ownerId: data.owner,
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

  async getByString(content: string) {
    return this.prisma.posts.findMany({
      where: {
        title: {
          contains: content,
        },
      },
    });
  }
}
