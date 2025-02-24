import { Module } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { ReviewRepository } from './review.repository';
import { PrismaService } from 'prisma/prisma.service';
import { LogModule } from '../log/log.module';
import { LogService } from '../log/log.service';
import { LogRepository } from '../log/log.repository';
import { UsersService } from '../users/users.service';
import { UsersRepository } from '../users/users.repository';

@Module({
  imports: [LogModule],
  controllers: [ReviewController],
  providers: [ReviewService, ReviewRepository, PrismaService, LogService, LogRepository, UsersRepository, UsersService],
})
export class ReviewModule {}
