import { Module } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { ReviewRepository } from './review.repository';
import { PrismaService } from '../../prisma/prisma.service';
import { PostService } from '../post/post.service';
import { PostRepository } from '../post/post.repository';
import { LogModule } from '../log/log.module';
import { LogService } from '../log/log.service';
import { LogRepository } from '../log/log.repository';

@Module({
  imports: [LogModule],
  controllers: [ReviewController],
  providers: [ReviewService, ReviewRepository, PrismaService, PostService, PostRepository, LogService, LogRepository],
})
export class ReviewModule {}
