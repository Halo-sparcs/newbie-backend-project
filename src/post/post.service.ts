import { Injectable } from '@nestjs/common';
import { PostRepository } from './post.repository';
import { createPostDto, updatePostDto } from './post.dto';

@Injectable()
export class PostService {
  constructor(private postRepository: PostRepository) {}

  async createPost(createPostDto: createPostDto) {
    return this.postRepository.createPost(createPostDto);
  }

  async deletePost(id: number) {
    await this.postRepository.deletePost(id);
  }

  async updatePost(id: number, updatePostDto: updatePostDto): Promise<void> {
    await this.postRepository.updatePost(id, updatePostDto);
  }

  async getById(id: number) {
    return this.postRepository.getById(Number(id));
  }

  async getByString(content: string) {
    // 유연한 검색 필요?
    return this.postRepository.getByString(content);
  }
}

