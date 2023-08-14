import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { IS_PUBLIC_KEY } from 'src/common/decorator/isPublic';
import * as jwt from 'jsonwebtoken';
import { JWT_SECRET } from './jwt.constants';
import { JwtPayload } from './jwt.interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private reflector: Reflector,
    private configService: ConfigService,
  ) {
    super();
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      const request = context.switchToHttp().getRequest();
      const token = request.cookies['jwt'];
      if (!!token) {
        const decoded = jwt.verify(
          token,
          this.configService.get('JWT_SECRET'),
        ) as JwtPayload;
        request.user = { id: decoded.sub, username: decoded.username };
      }

      return true;
    }
    return super.canActivate(context);
  }
}
