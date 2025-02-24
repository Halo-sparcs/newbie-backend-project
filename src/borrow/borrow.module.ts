import { Module } from '@nestjs/common';
import { LogModule } from '../log/log.module';
import { LogService } from '../log/log.service';
import { PrismaModule } from 'prisma/prisma.module';
import { PrismaService } from 'prisma/prisma.service';
import { BorrowService } from './borrow.service';
import { BorrowRepository } from './borrow.repository';
import { BorrowController } from './borrow.controller';

@Module({
  imports: [LogModule, PrismaModule],
  providers: [BorrowService, BorrowRepository, LogService, PrismaService],
  controllers: [BorrowController],
  exports: [BorrowRepository]
})
export class BorrowModule {}
