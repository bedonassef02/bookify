import { Injectable } from '@nestjs/common';
import { UserService } from '../user.service';
import { HashingService } from '../hashing/hashing.service';
import { UserDocument } from '../entities/user.entity';
import { AuthResponse, AuthTokens, SignUpDto } from '@app/shared';
import { RpcConflictException } from '@app/shared';
import { SignInDto } from '@app/shared/dto/user/sign-in.dto';
import { RpcUnauthorizedException } from '@app/shared';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Types } from 'mongoose';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly usersService: UserService,
    private readonly hashingService: HashingService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async signIn(signInDto: SignInDto): Promise<AuthResponse> {
    const user: UserDocument | null = await this.usersService.findByEmail(
      signInDto.email,
    );

    if (!user) {
      throw new RpcUnauthorizedException('email or password is incorrect');
    }

    if (!(await this.isSamePassword(signInDto.password, user.password))) {
      throw new RpcUnauthorizedException('email or password is incorrect');
    }

    const tokens = await this.generateTokens(user);

    return {
      user: this.sanitizeUser(user),
      tokens,
    };
  }

  async signUp(signUpDto: SignUpDto): Promise<AuthResponse> {
    const user: UserDocument | null = await this.usersService.findByEmail(
      signUpDto.email,
    );

    if (user) {
      throw new RpcConflictException('User already exists');
    }

    signUpDto.password = await this.hashingService.hash(signUpDto.password);
    const newUser = await this.usersService.create(signUpDto);

    const tokens = await this.generateTokens(newUser);

    return {
      user: this.sanitizeUser(newUser),
      tokens,
    };
  }

  private async isSamePassword(
    password: string,
    userPassword: string,
  ): Promise<boolean> {
    return this.hashingService.compare(password, userPassword);
  }

  private async generateTokens(user: UserDocument): Promise<AuthTokens> {
    const payload = {
      sub: (user._id as Types.ObjectId).toString(),
      email: user.email,
      role: user.role,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        expiresIn: this.configService.get<string>(
          'JWT_ACCESS_TOKEN_TTL',
          '15m',
        ),
      }),
      this.jwtService.signAsync(payload, {
        expiresIn: this.configService.get<string>(
          'JWT_REFRESH_TOKEN_TTL',
          '7d',
        ),
      }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  private sanitizeUser(user: UserDocument): Partial<UserDocument> {
    const { password, ...sanitizedUser } = user.toObject();
    return sanitizedUser;
  }

  async validateToken(token: string): Promise<any> {
    try {
      return await this.jwtService.verifyAsync(token);
    } catch (error) {
      throw new RpcUnauthorizedException('Invalid token');
    }
  }
}
