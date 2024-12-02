import { Module } from '@nestjs/common';
import { LogService } from './log.service';
import { PostService } from '../post/post.service';
import { PostRepository } from '../post/post.repository';
import { PrismaService } from '../../prisma/prisma.service';
import { LogController } from './log.controller';
import { LogRepository } from './log.repository';
import { ReviewService } from '../review/review.service';
import { ReviewRepository } from '../review/review.repository';
import { UsersService } from '../users/users.service';
import { UsersRepository } from '../users/users.repository';

@Module({
  imports: [],
  controllers: [LogController],
  providers: [LogService, LogRepository, PostService, PostRepository, PrismaService, ReviewService, ReviewRepository, UsersService, UsersRepository],
})
export class LogModule {}
