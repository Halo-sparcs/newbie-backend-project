import {
  Body,
  Controller,
  Request,
  Get,
  Param,
  Post,
  Delete,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { PostService } from './post.service';
import { createPostDto, updatePostDto } from './post.dto';
import { IsUserGuard } from '../auth/guards/isUser.guard';


@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @UseGuards(IsUserGuard)
  @Post('create')
  async createPost(@Req() req, @Body() body: createPostDto) {
    console.log(req.user.user_id);
    return this.postService.createPost(req.user.user_id, body);
  }

  @UseGuards(IsUserGuard)
  @Delete('delete/:id')
  async deletePost(@Request() req, @Param('id') id: number) {
    await this.postService.deletePost(req, Number(id));
  }

  @UseGuards(IsUserGuard)
  @Put('update/:id')
  async updatePost(
    @Request() req,
    @Param('id') id: number,
    @Body() body: updatePostDto,
  ): Promise<void> {
    await this.postService.updatePost(req, Number(id), body);
  }

  @Get('search/:name/:page')
  async searchPostByName(
    @Param('name') name: string,
    @Param('page') page: number,) {
    return this.postService.getByString(Number(page), name);
  }
}
