import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { PrismaService } from '../../prisma/prisma.service';
import { loginDto } from './auth.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';


@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService
  ) {}

  async login(loginDto: loginDto) {
    const { user_id, user_pwd } = loginDto;

    const user = await this.prisma.users.findUnique({ where: { user_id } });

    if (user && (await bcrypt.compare(user_pwd, user_id))) {
      const payload = { username: user.username, sub: user.id };
      return { access_token: this.jwtService.sign(payload) };
    }
  }
}
