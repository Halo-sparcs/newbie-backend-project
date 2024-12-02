import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  private readonly logger = new Logger(JwtStrategy.name);
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request) => {
          const tokenFromCookie = request?.cookies?.access_token || null;
          if (tokenFromCookie) return tokenFromCookie;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
    this.logger.log('JwtStrategy initialized');
  }

  async validate(payload: any) {
    return { user_id: payload.user_id, user_pwd: payload.user_pwd };
  }
}