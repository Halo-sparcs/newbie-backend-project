import { Module } from '@nestjs/common';
import { LogModule } from '../log/log.module';
import { LogService } from '../log/log.service';
import { PrismaModule } from 'prisma/prisma.module';
import { PrismaService } from 'prisma/prisma.service';
import { ReturnService } from './return.service';
import { ReturnController } from './return.controller';
import { ReturnRepository } from './return.repository';

@Module({
  imports: [LogModule, PrismaModule],
  providers: [ReturnService, ReturnRepository, LogService, PrismaService],
  controllers: [ReturnController],
  exports: [ReturnRepository, ReturnService],
})
export class ReturnModule {}
