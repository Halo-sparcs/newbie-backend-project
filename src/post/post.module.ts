import { Module } from '@nestjs/common';
import { PostController } from './Post.controller';
import { PostService } from './post.service';
import { PostRepository } from './post.repository';
import { PrismaService } from '../../prisma/prisma.service';
import { ReviewService } from '../review/review.service';
import { ReviewRepository } from '../review/review.repository';
import { LogModule } from '../log/log.module';
import { LogService } from '../log/log.service';
import { LogRepository } from '../log/log.repository';
import { UsersService } from '../users/users.service';
import { UsersRepository } from '../users/users.repository';

@Module({
  imports: [LogModule],
  controllers: [PostController],
  providers: [PostService, PostRepository, PrismaService, ReviewService, ReviewRepository, LogService, LogRepository, UsersService, UsersRepository],
})
export class PostModule {}
