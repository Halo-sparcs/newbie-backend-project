import { Injectable, ForbiddenException } from '@nestjs/common';
import { PostRepository } from './post.repository';
import { LogRepository } from '../log/log.repository';
import { BorrowRepository } from '../borrow/borrow.repository';
import { createPostDto, updatePostDto } from './post.dto';

@Injectable()
export class PostService {
  constructor(
    private postRepository: PostRepository,
    private readonly logRepository: LogRepository,
    private readonly borrowRepository: BorrowRepository,
    ) {}

  async createPost(user_id: number, createPostDto: createPostDto) {
    return this.postRepository.createPost(user_id, createPostDto);
  }

  async deletePost(req, id: number) {
    const logs = await this.logRepository.getByPostId(id);
    if (logs.length > 0) {
      throw new ForbiddenException("You are borrowing that post right now");
    }

    const post = await this.postRepository.getById(id);
    if (req.user.user_id !== post.ownerId) {
      throw new ForbiddenException("You don't have permission to delete post.");
    }

    await this.borrowRepository.deleteByPostId(id);

    await this.postRepository.deletePost(id);
  }

  async updatePost(req, id: number, updatePostDto: updatePostDto): Promise<void> {
    const post = await this.postRepository.getById(id);
    if (req.user.user_id !== post.ownerId) {
      throw new ForbiddenException("You don't have permission to update post");
    }
    await this.postRepository.updatePost(id, updatePostDto);
  }

  async getById(id: number) {
    return this.postRepository.getById(Number(id));
  }

  async getByString(page: number, content: string) {
    return this.postRepository.getByString(page, content);
  }
}
