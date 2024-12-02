import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersRepository } from '../users/users.repository';
import { loginDto } from './auth.dto';
import { JwtService } from '@nestjs/jwt';

import { LogService } from '../log/log.service';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly UsersRepository: UsersRepository,
    private readonly logService: LogService,
    private readonly userService: UsersService,
  ) {}

  async login(loginDto: loginDto) {
    const isUser = this.validateUser(loginDto);

    const accessToken = isUser ? await this.createAccessToken(loginDto) : 'False';
    const refreshToken = await this.createRefreshToken(loginDto);

    return { accessToken, refreshToken };
  }

  async refresh(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });

      const user = await this.userService.getByUserId(payload.user_id);

      if (user === null) {
        throw new UnauthorizedException('Wrong Payload');
      }

      const isMatch = refreshToken === user.refreshToken;
      if (!isMatch) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const newAccessToken = await this.createAccessToken({
        user_id: user.user_id,
        user_pwd: user.user_pwd,
      });
      return newAccessToken;
    } catch (e) {
      throw new UnauthorizedException(`Refresh token expired or invalid, ${e}`);
    }
  }

  async logout(user_id: string) {
    const user = await this.UsersRepository.getByUserId(user_id);
    const result = await this.UsersRepository.updateUserRefreshToken(user.id, null);
    console.log(result.refreshToken);
  }

  async withdraw(id: number) {
    const notReturned = await this.logService.getByOwnerId(id);
    if (notReturned.length >= 1) {
      throw new Error('You got unreturned items');
    }
    const borrowing = await this.logService.getByBorrowerId(id);
    if (borrowing.length >= 1) {
      throw new Error("You didn't returned items");
    }
    await this.userService.deleteUser(id);
  }

  async validateUser(loginDto: loginDto) {
    const { user_id, user_pwd } = loginDto;

    const user = await this.UsersRepository.getByUserId(user_id);
    const pwdMatches = await bcrypt.compare(user_pwd, user.user_pwd);

    if (!pwdMatches) {
      throw new UnauthorizedException('Password does not match');
    } else {
      return true;
    }
  }

  async createAccessToken(user: loginDto) {
    const payload = {
      user_id: user.user_id,
      user_pwd: user.user_pwd,
    };

    const options = {
      expiresIn: '15m',
      secret: process.env.JWT_SECRET,
    };

    const accessToken = await this.jwtService.signAsync(payload, options);
    return accessToken;
  }

  async createRefreshToken(info: loginDto) {
    const payload = {
      user_id: info.user_id,
      user_pwd: info.user_pwd,
    };

    const options = {
      expiresIn: '6h',
      secret: process.env.JWT_REFRESH_SECRET,
    };

    const refreshToken = this.jwtService.sign(payload, options);

    const user = await this.UsersRepository.getByUserId(info.user_id);
    await this.UsersRepository.updateUserRefreshToken(user.id, refreshToken);

    return refreshToken;
  }
}
