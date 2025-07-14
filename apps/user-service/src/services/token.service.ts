import { Injectable } from '@nestjs/common';
import { AuthTokens, RpcUnauthorizedException, UserType } from '@app/shared';
import { JwtService } from '@nestjs/jwt';
import * as crypto from 'crypto';

@Injectable()
export class TokenService {
  private refreshTokens = new Map();
  constructor(private readonly jwtService: JwtService) {}

  validate(token: string): Promise<any> {
    try {
      return this.jwtService.verifyAsync(token);
    } catch (error) {
      throw new RpcUnauthorizedException('Invalid token');
    }
  }

  async generate(user: UserType): Promise<AuthTokens> {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload),
      this.generateRefreshToken(user.id),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  private generateRefreshToken(userId: string): string {
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    this.refreshTokens.set(token, { userId, expiresAt });
    this.cleanupExpired();

    return token;
  }

  private cleanupExpired() {
    const now = new Date();
    for (const [token, data] of this.refreshTokens.entries()) {
      if (data.expiresAt < now) {
        this.refreshTokens.delete(token);
      }
    }
  }
}
