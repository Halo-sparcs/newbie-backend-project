import { Module } from '@nestjs/common';
import { PostController } from './Post.controller';
import { PostService } from './post.service';
import { PostRepository } from './post.repository';
import { PrismaService } from 'prisma/prisma.service';
import { PrismaModule } from 'prisma/prisma.module';
import { LogModule } from '../log/log.module';
import { LogService } from '../log/log.service';
import { LogRepository } from '../log/log.repository';
import { BorrowModule } from '../borrow/borrow.module';
import { BorrowRepository } from '../borrow/borrow.repository';

@Module({
  imports: [LogModule, PrismaModule, BorrowModule],
  controllers: [PostController],
  providers: [PostService, PostRepository, PrismaService, LogService, LogRepository, BorrowRepository],
})
export class PostModule {}
