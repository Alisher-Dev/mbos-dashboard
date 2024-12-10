import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import token from './token';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Invalid Authorization header');
    }

    const accessToken = authHeader.split(' ')[1];
    if (!accessToken) {
      throw new UnauthorizedException('You must be logged in');
    }

    const payload = token.verifyAccessToken(accessToken);

    if (!payload || !payload.userId) {
      throw new UnauthorizedException('Invalid token payload');
    }

    request.userId = payload.userId;

    return true;
  }
}
