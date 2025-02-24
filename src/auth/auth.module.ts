import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersService } from '../users/users.service';
import { UsersRepository } from '../users/users.repository';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './auth.strategy';
import { PassportModule } from '@nestjs/passport';
import { LogService } from '../log/log.service';
import { LogRepository } from '../log/log.repository';
import { PostService } from '../post/post.service';
import { PostRepository } from '../post/post.repository';
import { PrismaService } from 'prisma/prisma.service';
import { IsUserGuard } from './guards/isUser.guard';
import { UsersModule } from '../users/users.module';
import { BorrowModule } from '../borrow/borrow.module';
import { BorrowService } from '../borrow/borrow.service';
import { BorrowRepository } from '../borrow/borrow.repository';
import { LogModule } from '../log/log.module';
import * as process from 'node:process';

@Module({
  imports: [
    UsersModule,
    BorrowModule,
    LogModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '15m' },
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),

  ],
  providers: [
    AuthService,
    UsersRepository,
    UsersService,
    PrismaService,
    LogService,
    LogRepository,
    PostService,
    PostRepository,
    JwtStrategy,
    IsUserGuard,
    BorrowService,
    BorrowRepository,
  ],
  controllers: [AuthController],
  exports: [IsUserGuard],
})
export class AuthModule {}
