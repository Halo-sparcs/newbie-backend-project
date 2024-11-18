import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Delete,
  Put,
} from '@nestjs/common';
import { PostService } from './post.service';
import { createPostDto, updatePostDto } from './post.dto';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post('/create')
  async createPost(@Body() body: createPostDto): Promise<void> {
    await this.postService.createPost(body);
  }

  @Delete('/delete')
  async deletePost(@Param('id') id: number) {
    await this.postService.deletePost(id);
  }

  @Put('/update')
  async updatePost(
    @Param('id') id: number,
    @Body() body: updatePostDto,
  ): Promise<void> {
    await this.postService.updatePost(id, body);
  }
}
