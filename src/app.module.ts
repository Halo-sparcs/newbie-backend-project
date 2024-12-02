import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersService } from './users/users.service';
import { UsersModule } from './users/users.module';
import { PostController } from './post/post.controller';
import { PostService } from './post/post.service';
import { PostModule } from './post/post.module';
import { PrismaService } from '../prisma/prisma.service';
import { PrismaModule } from '../prisma/prisma.module';
import { UsersRepository } from './users/users.repository';
import { PostRepository } from './post/post.repository';
import { LogRepository } from './log/log.repository';
import { LogService } from './log/log.service';
import { ReviewRepository } from './review/review.repository';
import { ReviewService } from './review/review.service';
import { ReviewModule } from './review/review.module';
import { LogModule } from './log/log.module';

@Module({
  controllers: [AppController, PostController],
  imports: [
    AuthModule,
    UsersModule,
    PostModule,
    PrismaModule,
    LogModule,
    ReviewModule,
  ],
  providers: [
    AppService,
    UsersService,
    PostService,
    PrismaService,
    UsersRepository,
    PostRepository,
    LogService,
    LogRepository,
    ReviewService,
    ReviewRepository,
  ],
})
export class AppModule {}
