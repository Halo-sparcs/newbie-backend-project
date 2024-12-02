import { Injectable } from '@nestjs/common';
import { LogRepository } from './log.repository';
import { createLogDto } from './log.dto';
import { PostService } from '../post/post.service';

@Injectable()
export class LogService {
  constructor(
    private readonly logRepository: LogRepository,
    private readonly postService: PostService,
  ) {}

  // it is also a createLog.
  async lend(createLogDto: createLogDto) {
    const post = await this.postService.getById(createLogDto.post_id);
    if (post.amount < createLogDto.amount) {
      throw new Error('Requested amount exceeds remaining');
    }
    post.amount -= createLogDto.amount;
    const log = await this.logRepository.createLog(createLogDto);
    post.logs.push(log);
    await this.postService.updatePost(post.id, post);
  }

  async getByBorrowerId(borrower_id: number) {
    return this.logRepository.getByBorrowerId(borrower_id);
  }

  async getByOwnerId(owner_id: number) {
    return this.logRepository.getByOwnerId(owner_id);
  }

  async getById(id: number) {
    return this.logRepository.getById(id);
  }

  async return(log_id: number) {
    const log = await this.logRepository.getById(log_id);
    const postId = log.post_id;
    const post = await this.postService.getById(postId);
    post.amount += log.amount;
    await this.postService.updatePost(postId, post);
    return this.logRepository.return(log_id);
  }
}
