import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Delete,
  Put,
  UseGuards,
  SetMetadata,
} from '@nestjs/common';
import { PostService } from './post.service';
import { createPostDto, updatePostDto } from './post.dto';
import { IsUserGuard } from '../auth/guards/isUser.guard';
import { AuthorGuard } from '../auth/guards/authorGuard.guard';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @UseGuards(IsUserGuard)
  @Post('/create')
  async createPost(@Body() body: createPostDto) {
    return this.postService.createPost(body);
  }

  @UseGuards(AuthorGuard)
  @SetMetadata('resourceType', 'post')
  @Delete('delete/:id')
  async deletePost(@Param('id') id: number) {
    await this.postService.deletePost(Number(id));
  }

  @UseGuards(AuthorGuard)
  @SetMetadata('resourceType', 'post')
  @Put('/update')
  async updatePost(
    @Param('id') id: number,
    @Body() body: updatePostDto,
  ): Promise<void> {
    await this.postService.updatePost(Number(id), body);
  }

  @Get('/search:name')
  async searchPostByName(@Param('name') name: string) {
    await this.postService.getByString(name);
  }
}
