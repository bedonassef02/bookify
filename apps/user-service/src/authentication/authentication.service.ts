import { Injectable } from '@nestjs/common';
import { UserService } from '../user.service';
import { User } from '../entities/user.entity';
import {
  AuthResponse,
  ChangePasswordDto,
  GoogleUserDto,
  RpcConflictException,
  RpcNotFoundException,
  RpcUnauthorizedException,
  SignInDto,
  SignUpDto,
} from '@app/shared';
import { TokenService } from '../services/token.service';
import { PasswordService } from '../services/password.service';
import { CredentialsService } from '../services/credentials.service';
import { NotificationService } from '../mailer/notification.service';
import { TokenType } from '../entities/token.entity';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly usersService: UserService,
    private readonly passwordService: PasswordService,
    private readonly tokenService: TokenService,
    private readonly credentialsService: CredentialsService,
    private readonly notificationService: NotificationService,
  ) {}

  async signIn(signInDto: SignInDto): Promise<AuthResponse> {
    const user: User = await this.validateUser(signInDto);

    if (user.isTwoFactorAuthenticationEnabled) {
      return {
        user: this.usersService.sanitize(user),
        twoFactorAuthenticationRequired: true,
      };
    }

    return this.generateResponse(user);
  }

  async signUp(signUpDto: SignUpDto): Promise<AuthResponse> {
    const existingUser = await this.usersService.findByEmail(signUpDto.email);
    if (existingUser) {
      throw new RpcConflictException('User already exists');
    }

    const password = await this.passwordService.hash(signUpDto.password);
    const user = await this.usersService.create({ ...signUpDto, password });
    const token = await this.tokenService.create(
      user.id as string,
      TokenType.CONFIRM,
    );
    this.notificationService.sendConfirmation(user, token.token);

    return this.generateResponse(user);
  }

  async signInGoogle(googleUser: GoogleUserDto): Promise<AuthResponse> {
    let user = await this.usersService.findByEmail(googleUser.email);

    if (!user) {
      user = await this.usersService.create({
        email: googleUser.email,
        firstName: googleUser.firstName,
        lastName: googleUser.lastName,
      });

      user.verified = true;
      await user.save();
    }

    return this.generateResponse(user);
  }

  async changePassword(
    id: string,
    passwordDto: ChangePasswordDto,
  ): Promise<AuthResponse> {
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
    this.notificationService.sendPasswordChangeSuccess(user);

    return this.generateResponse(user);
  }

  async confirmEmail(token: string): Promise<{ message: string }> {
    const tokenDoc = await this.tokenService.findOne(token, TokenType.CONFIRM);

    await Promise.all([
      this.usersService.update(tokenDoc.userId, { verified: true }),
      this.tokenService.delete(tokenDoc.userId, TokenType.CONFIRM),
    ]);

    return { message: 'Email confirmed successfully. You can now sign in.' };
  }

  async resendConfirmation(id: string): Promise<{ success: boolean }> {
    await this.tokenService.delete(id, TokenType.CONFIRM);

    const [user, token] = await Promise.all([
      this.usersService.findOne(id),
      this.tokenService.create(id, TokenType.CONFIRM),
    ]);
    this.notificationService.sendConfirmation(user, token.token);

    return { success: true };
  }

  async forgotPassword(email: string): Promise<{ message: string }> {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new RpcNotFoundException('This email is not exist');
    }

    const token = await this.tokenService.create(
      user.id as string,
      TokenType.RESET,
    );
    this.notificationService.sendPasswordReset(user, token.token);

    return { message: 'We have emailed you a password reset link.' };
  }

  async resetPassword(
    token: string,
    newPassword: string,
  ): Promise<{ message: string }> {
    const tokenDoc = await this.tokenService.findOne(token, TokenType.RESET);
    const user = await this.usersService.findOne(tokenDoc.userId);

    const password = await this.passwordService.hash(newPassword);
    const credentials = this.credentialsService.updatePassword(user);

    await Promise.all([
      this.usersService.update(tokenDoc.userId, {
        password,
        credentials,
      }),
      this.tokenService.delete(tokenDoc.userId, TokenType.RESET), // Clean up token
    ]);

    this.notificationService.sendPasswordChangeSuccess(user);

    return { message: 'Password reset successful.' };
  }

  private async validateUser(signInDto: SignInDto): Promise<User> {
    const user = await this.usersService.findByEmail(signInDto.email);
    if (!user || !(await this.isValidPassword(user, signInDto.password))) {
      throw new RpcUnauthorizedException('Invalid credentials');
    }

    return user;
  }

  private async isValidPassword(
    user: User,
    password: string,
  ): Promise<boolean> {
    await this.passwordService.isLast(user, password);

    const isValidPassword = await this.passwordService.compare(
      password,
      user.password,
    );
    if (!isValidPassword) {
      throw new RpcUnauthorizedException('Invalid credentials');
    }

    return true;
  }

  async generateTokensForUser(id: string): Promise<AuthResponse> {
    const user = await this.usersService.findOne(id);
    if (!user) throw new RpcNotFoundException('User not found');

    return this.generateResponse(user);
  }

  private async generateResponse(user: User): Promise<AuthResponse> {
    const tokens = await this.tokenService.generate(user);

    return { user: this.usersService.sanitize(user), tokens };
  }
}
