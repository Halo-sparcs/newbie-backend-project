import { Injectable } from '@nestjs/common';
import { PostRepository } from './post.repository';
import { createPostDto, updatePostDto } from './post.dto';

@Injectable()
export class PostService {
  private constructor(private readonly postRepository: PostRepository) {}
  async createPost(createPostDto: createPostDto): Promise<void> {
    await this.postRepository.createPost(createPostDto);
  }

  async deletePost(id: number) {
    // 만약 id의 owner에 대한 validate 실패시) faq;
    await this.postRepository.deletePost(id);
  }

  async updatePost(id: number, updatePostDto: updatePostDto): Promise<void> {
    await this.postRepository.updatePost(id, updatePostDto);
  }

  async getAll(page: number = 1) {
    await this.postRepository.getAll(page);
  }

  async getById(id: number) {
    await this.postRepository.getById(id);
  }

  async getByString(content: string) {
    // 유연한 검색 필요
  }
}
