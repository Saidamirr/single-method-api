import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthUser, JwtPayload } from '../../auth-user';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET || 'super_secret_key',
    });
  }

  validate(payload: JwtPayload): AuthUser {
    return {
      userId: payload.sub,
      username: payload.username,
      role: payload.role,
    };
  }
}
