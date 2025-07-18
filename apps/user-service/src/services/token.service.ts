import { Injectable } from '@nestjs/common';
import { AuthTokens } from '@app/shared';
import { JwtService } from '@nestjs/jwt';
import * as crypto from 'crypto';
import { User } from '../entities/user.entity';

@Injectable()
export class TokenService {
  private refreshTokens = new Map();
  constructor(private readonly jwtService: JwtService) {}

  async generate(user: User): Promise<AuthTokens> {
    const payload = {
      sub: user.id as string,
      email: user.email,
      role: user.role,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload),
      this.generateRefreshToken(user.id as string),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  private generateRefreshToken(userId: string): string {
    const token = this.generateRandomToken();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    this.refreshTokens.set(token, { userId, expiresAt });
    this.cleanupExpired();

    return token;
  }

  generateRandomToken(): string {
    return crypto.randomBytes(32).toString('hex');
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
