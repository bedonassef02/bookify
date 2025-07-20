import { Injectable } from '@nestjs/common';
import { AuthTokens, RpcNotFoundException } from '@app/shared';
import { JwtService } from '@nestjs/jwt';
import * as crypto from 'crypto';
import { User } from '../entities/user.entity';
import { TokenRepository } from '../repositories/token.repository';
import { Token, TokenType } from '../entities/token.entity';

interface RefreshToken {
  userId: string;
  expiresAt: Date;
}

@Injectable()
export class TokenService {
  private refreshTokens = new Map<string, RefreshToken>();
  constructor(
    private readonly tokenRepository: TokenRepository,
    private readonly jwtService: JwtService,
  ) {}

  async findOne(token: string, type: TokenType): Promise<Token> {
    const tokenDoc = await this.tokenRepository.findOne(token, type);
    if (!tokenDoc) {
      throw new RpcNotFoundException('Invalid or expired token');
    }

    return tokenDoc;
  }

  delete(userId: string, type: TokenType): Promise<void> {
    return this.tokenRepository.deleteOne(userId, type);
  }

  create(userId: string, type: TokenType): Promise<Token> {
    return this.tokenRepository.create({
      type,
      token: this.generateRandomToken(),
      userId,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000),
    });
  }

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

  private generateRandomToken(): string {
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
