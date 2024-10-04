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
    const accessToken = request.headers.authorization?.split(' ')[1];

    if (!accessToken) {
      throw new UnauthorizedException('You must be logged in');
    }

    const payload = token.verifyAccessToken(accessToken);

    request.userId = payload.userId;

    return true;
  }
}
