import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { Posts } from '@prisma/client';
import { createPostDto, updatePostDto } from './post.dto';

@Injectable()
export class PostRepository {
  constructor(private readonly prisma: PrismaService) {}


  async createPost(data: createPostDto): Promise<Posts> {
    return this.prisma.post.create({
      data: {
        title: data.title,
        content: data.content,
        amount: data.amount
      }
    });
  }


  async updatePost(id: number, data: updatePostDto): Promise<Posts> {
    return this.prisma.post.update({
      where: { id },
      data: {
        title: data.title,
        content: data.content,
        amount: data.amount
      }
    });
  }


  async deletePost(id: number): Promise<Posts> {
    return this.prisma.post.delete({
      where: { id },
    });
  }

  async getAll(): Promise<Post[]> {
    return this.prisma.post.findMany();
  }

  async getById(id: number): Promise<Post[]> {
    return this.prisma.post.findUnique({
      where: { id },
    });
  }
}
