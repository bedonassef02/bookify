import { Injectable } from '@nestjs/common';
import { UserService } from '../user.service';
import { UserDocument } from '../entities/user.entity';
import { AuthResponse, SignUpDto, UserType } from '@app/shared';
import { RpcConflictException, RpcUnauthorizedException } from '@app/shared';
import { SignInDto } from '@app/shared/dto/user/sign-in.dto';
import { TokenService } from '../services/token.service';
import { PasswordService } from '../services/password.service';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly usersService: UserService,
    private readonly passwordService: PasswordService,
    private readonly tokenService: TokenService,
  ) {}

  async signIn(signInDto: SignInDto): Promise<AuthResponse> {
    const user: UserType | null = await this.validateUser(
      signInDto.email,
      signInDto.password,
    );
    if (!user) {
      throw new RpcUnauthorizedException('Invalid credentials');
    }

    const tokens = await this.tokenService.generate(user);
    return {
      user,
      tokens,
    };
  }

  async signUp(signUpDto: SignUpDto): Promise<AuthResponse> {
    const existingUser = await this.usersService.findByEmail(signUpDto.email);
    if (existingUser) {
      throw new RpcConflictException('User already exists');
    }

    const password = await this.passwordService.hash(signUpDto.password);
    const newUser = await this.usersService.create({ ...signUpDto, password });

    const user = this.sanitizeUser(newUser);
    const tokens = await this.tokenService.generate(user);

    return { user, tokens };
  }

  async validateUser(
    email: string,
    password: string,
  ): Promise<UserType | null> {
    const user = await this.usersService.findByEmail(email);
    if (!user) return null;

    const isValidPassword = await this.passwordService.compare(
      password,
      user.password,
    );
    if (!isValidPassword) return null;

    return this.sanitizeUser(user);
  }

  private sanitizeUser(user: UserDocument): UserType {
    return plainToInstance(UserType, user, { excludePrefixes: ['password'] });
  }
}
