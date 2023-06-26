import { Injectable } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { JWT_SECRET } from './jwt.constants';
import { JwtPayload } from './jwt.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      // jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      jwtFromRequest: ExtractJwt.fromExtractors([jwtCookieExtractor]),
      ignoreExpiration: false,
      secretOrKey: JWT_SECRET,
    });
  }

  async validate(payload: JwtPayload) {
    return { userId: payload.sub, username: payload.username };
  }
}

const jwtCookieExtractor = (req: Request) => {
  var token = null;
  if (req && req.cookies) {
    token = req.cookies['jwt'];
  }
  return token;
};
