import { Injectable } from '@nestjs/common';
import { AuthTokens, RpcNotFoundException } from '@app/shared';
import { JwtService } from '@nestjs/jwt';
import * as crypto from 'crypto';
import { User } from '../entities/user.entity';
import { TokenRepository } from '../repositories/token.repository';
import { Token, TokenType } from '../entities/token.entity';
import { RefreshTokenRepository } from '../repositories/refresh-token.repository';

@Injectable()
export class TokenService {
  constructor(
    private readonly tokenRepository: TokenRepository,
    private readonly refreshTokenRepository: RefreshTokenRepository,
    private readonly jwtService: JwtService,
  ) {}

  async findOne(token: string, type: TokenType): Promise<Token> {
    const tokenDoc = await this.tokenRepository.findOne({ token, type });
    if (!tokenDoc) {
      throw new RpcNotFoundException('Invalid or expired token');
    }

    return tokenDoc;
  }

  async delete(userId: string, type: TokenType): Promise<void> {
    await this.tokenRepository.deleteOne({ userId, type });
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

  async invalidateRefreshToken(token: string): Promise<void> {
    await this.refreshTokenRepository.deleteOne({ token });
  }

  async invalidateAllRefreshTokens(userId: string): Promise<void> {
    await this.refreshTokenRepository.deleteMany({ userId });
  }

  private async generateRefreshToken(userId: string): Promise<string> {
    const token = this.generateRandomToken();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await this.refreshTokenRepository.create({
      token,
      userId,
      expiresAt,
    });

    return token;
  }

  private generateRandomToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }
}
