import { Injectable } from '@nestjs/common';
import { UserService } from '../user.service';
import { User } from '../entities/user.entity';
import {
  AuthResponse,
  RpcNotFoundException,
  SignUpDto,
  UserType,
  RpcConflictException,
  RpcUnauthorizedException,
  ChangePasswordDto,
} from '@app/shared';
import { SignInDto } from '@app/shared/dto/user/sign-in.dto';
import { TokenService } from '../services/token.service';
import { PasswordService } from '../services/password.service';
import { CredentialsService } from '../services/credentials.service';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly usersService: UserService,
    private readonly passwordService: PasswordService,
    private readonly tokenService: TokenService,
    private readonly credentialsService: CredentialsService,
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

    const user = this.usersService.sanitize(newUser);
    const tokens = await this.tokenService.generate(user);

    return { user, tokens };
  }

  async changePassword(
    id: string,
    passwordDto: ChangePasswordDto,
  ): Promise<boolean> {
    const user: User = await this.usersService.findOne(id);
    if (!user) throw new RpcNotFoundException('User not found');

    await this.passwordService.verify(
      passwordDto.currentPassword,
      user.password,
    );

    this.passwordService.ensureDifferent(passwordDto);

    const credentials = this.credentialsService.updatePassword(user);
    const password = await this.passwordService.hash(passwordDto.newPassword);
    await this.usersService.update(id, { password, credentials });

    return true;
  }

  private async validateUser(
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

    return this.usersService.sanitize(user);
  }
}
