import { Injectable } from '@nestjs/common';
import { UserService } from '../user.service';
import { User } from '../entities/user.entity';
import {
  AuthResponse,
  RpcNotFoundException,
  SignInDto,
  SignUpDto,
  RpcConflictException,
  RpcUnauthorizedException,
  ChangePasswordDto,
} from '@app/shared';
import { TokenService } from '../services/token.service';
import { PasswordService } from '../services/password.service';
import { CredentialsService } from '../services/credentials.service';
import { NotificationService } from '../mailer/notification.service';

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
    const user: User = await this.validateUser(
      signInDto.email,
      signInDto.password,
    );

    return this.generateResponse(user);
  }

  async signUp(signUpDto: SignUpDto): Promise<AuthResponse> {
    const existingUser = await this.usersService.findByEmail(signUpDto.email);
    if (existingUser) {
      throw new RpcConflictException('User already exists');
    }

    const password = await this.passwordService.hash(signUpDto.password);
    const user = await this.usersService.create({ ...signUpDto, password });

    const confirmationToken = this.tokenService.generateRandomToken();
    await this.usersService.update(user.id as string, {
      confirmationToken,
      confirmationTokenExpiry: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
    });

    this.notificationService.sendConfirmation(user, confirmationToken);

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
    const user = await this.usersService.findByConfirmationToken(token);

    await this.usersService.update(user.id as string, {
      verified: true,
      confirmationToken: null,
      confirmationTokenExpiry: null,
    });

    return { message: 'Email confirmed successfully. You can now sign in.' };
  }

  async resendConfirmation(id: string): Promise<{ success: boolean }> {
    const user = await this.usersService.findOne(id);
    const confirmationToken = this.tokenService.generateRandomToken();
    this.notificationService.sendConfirmation(user, confirmationToken);
    return { success: true };
  }

  async forgotPassword(email: string): Promise<{ message: string }> {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new RpcNotFoundException('This email is not exist');
    }

    const resetToken = this.tokenService.generateRandomToken();
    const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await this.usersService.update(user.id as string, {
      resetPasswordToken: resetToken,
      resetPasswordTokenExpiry: resetTokenExpiry,
    });

    this.notificationService.sendPasswordReset(user, resetToken);

    return { message: 'We have emailed you a password reset link.' };
  }

  async resetPassword(
    token: string,
    newPassword: string,
  ): Promise<{ message: string }> {
    const user = await this.usersService.findByResetToken(token);

    const password = await this.passwordService.hash(newPassword);
    const credentials = this.credentialsService.updatePassword(user);

    await this.usersService.update(user.id as string, {
      password,
      credentials,
      resetPasswordToken: null,
      resetPasswordTokenExpiry: null,
    });

    this.notificationService.sendPasswordChangeSuccess(user);

    return { message: 'Password reset successful.' };
  }

  private async validateUser(email: string, password: string): Promise<User> {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new RpcUnauthorizedException('Invalid credentials');
    }

    await this.passwordService.isLast(user, password);
    const isValidPassword = await this.passwordService.compare(
      password,
      user.password,
    );
    if (!isValidPassword) {
      throw new RpcUnauthorizedException('Invalid credentials');
    }

    return user;
  }

  private async generateResponse(user: User): Promise<AuthResponse> {
    const tokens = await this.tokenService.generate(user);

    return { user: this.usersService.sanitize(user), tokens };
  }
}
