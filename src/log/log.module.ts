import { Module } from '@nestjs/common';
import { LogService } from './log.service';
import { PrismaService } from 'prisma/prisma.service';
import { LogController } from './log.controller';
import { LogRepository } from './log.repository';
import { PrismaModule } from 'prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [LogController],
  providers: [LogService, LogRepository, PrismaService],
  exports: [LogRepository, LogService],
})
export class LogModule {}
