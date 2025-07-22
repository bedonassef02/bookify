import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import {
  AuthResponse,
  GoogleUserDto,
  Patterns,
  SignInDto,
  SignUpDto,
} from '@app/shared';
import { AuthenticationService } from './authentication.service';
import { ChangePasswordDto } from '@app/shared/dto/user/change-password.dto';
import { TwoFactorAuthenticationService } from './2fa/2fa.service';

@Controller('authentication')
export class AuthenticationController {
  constructor(
    private readonly authService: AuthenticationService,
    private readonly twoFactorAuthenticationService: TwoFactorAuthenticationService,
  ) {}

  @MessagePattern(Patterns.AUTH.SIGN_UP)
  signUp(signUpDto: SignUpDto): Promise<AuthResponse> {
    return this.authService.signUp(signUpDto);
  }

  @MessagePattern(Patterns.AUTH.SIGN_IN)
  signIn(signInDto: SignInDto): Promise<AuthResponse> {
    return this.authService.signIn(signInDto);
  }

  @MessagePattern(Patterns.AUTH.CHANGE_PASSWORD)
  changePassword(
    @Payload('id') id: string,
    @Payload('passwordDto') passwordDto: ChangePasswordDto,
  ): Promise<AuthResponse> {
    return this.authService.changePassword(id, passwordDto);
  }

  @MessagePattern(Patterns.AUTH.CONFIRM_EMAIL)
  confirmEmail(@Payload('token') token: string): Promise<{ message: string }> {
    return this.authService.confirmEmail(token);
  }

  @MessagePattern(Patterns.AUTH.RESEND_CONFIRMATION)
  resendConfirmation(@Payload('id') id: string): Promise<{ success: boolean }> {
    return this.authService.resendConfirmation(id);
  }

  @MessagePattern(Patterns.AUTH.FORGOT_PASSWORD)
  forgotPassword(
    @Payload('email') email: string,
  ): Promise<{ message: string }> {
    return this.authService.forgotPassword(email);
  }

  @MessagePattern(Patterns.AUTH.RESET_PASSWORD)
  resetPassword(
    @Payload('token') token: string,
    @Payload('newPassword') newPassword: string,
  ): Promise<{ message: string }> {
    return this.authService.resetPassword(token, newPassword);
  }

  @MessagePattern(Patterns.AUTH.SIGN_IN_GOOGLE)
  signInGoogle(user: GoogleUserDto): Promise<AuthResponse> {
    return this.authService.signInGoogle(user);
  }

  @MessagePattern(Patterns.AUTH.VERIFY_2FA_SIGNIN)
  verifySignIn(
    @Payload('email') email: string,
    @Payload('code') code: string,
  ): Promise<AuthResponse> {
    return this.twoFactorAuthenticationService.verifySignIn(email, code);
  }
}
