import { envConfig } from 'src/config/env.config';
import { IPayload } from './type';
import { sign, verify } from 'jsonwebtoken';
import { UnauthorizedException } from '@nestjs/common';

class Token {
  private readonly accessSecret: string;
  private readonly refreshSecret: string;

  constructor() {
    this.accessSecret = envConfig.jwt.accessSecret;
    this.refreshSecret = envConfig.jwt.refreshSecret;
  }

  generateAccessToken(payload: IPayload) {
    return sign(payload, this.accessSecret, { expiresIn: '10m' });
  }

  generateRefreshToken(payload: IPayload) {
    return sign(payload, this.refreshSecret, { expiresIn: '7d' });
  }

  verifyAccessToken(accessToken: string) {
    try {
      return verify(accessToken, this.accessSecret) as IPayload;
    } catch (error) {
      throw new UnauthorizedException('authentic token');
    }
  }

  verifyRefreshToken(refreshToken: string) {
    try {
      return verify(refreshToken, this.refreshSecret) as IPayload;
    } catch (error) {
      throw new UnauthorizedException('authentic token');
    }
  }
}

export default new Token();
