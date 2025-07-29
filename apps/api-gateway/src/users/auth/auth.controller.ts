import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Post,
  Put,
  UseGuards,
  Req,
} from '@nestjs/common';
import {
  AuthResponse,
  Patterns,
  SignUpDto,
  USER_SERVICE,
  ChangePasswordDto,
} from '@app/shared';
import { ClientProxy } from '@nestjs/microservices';
import { Public } from './decorators/public.decorator';
import { Observable } from 'rxjs';
import { CurrentUser } from './decorators/current-user.decorator';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { Request } from 'express';
import { map } from 'rxjs/operators';
import { AuthGuard } from '@nestjs/passport';

@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(@Inject(USER_SERVICE) private client: ClientProxy) {}

  @Public()
  @Post('sign-in')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('local'))
  signIn(@CurrentUser() user: any): Observable<AuthResponse> {
    return this.client.send(Patterns.AUTH.SIGN_IN, user).pipe(
      map((response: AuthResponse) => {
        if (response.twoFactorAuthenticationRequired) {
          return {
            user: response.user,
            twoFactorAuthenticationRequired: true,
          };
        }
        return response;
      }),
    );
  }

  @Public()
  @Post('sign-up')
  signUp(@Body() signUpDto: SignUpDto): Observable<AuthResponse> {
    return this.client.send(Patterns.AUTH.SIGN_UP, signUpDto);
  }

  @Put('change-password')
  changePassword(
    @CurrentUser('userId') id: string,
    @Body() passwordDto: ChangePasswordDto,
  ): Observable<AuthResponse> {
    return this.client.send(Patterns.AUTH.CHANGE_PASSWORD, {
      id,
      passwordDto,
    });
  }

  @Public()
  @Get('confirm/:token')
  confirmEmail(@Param('token') token: string): Observable<{ message: string }> {
    return this.client.send(Patterns.AUTH.CONFIRM_EMAIL, { token });
  }

  @Post('resend-confirmation')
  resendConfirmation(
    @CurrentUser('userId') id: string,
  ): Observable<{ success: boolean }> {
    return this.client.send(Patterns.AUTH.RESEND_CONFIRMATION, { id });
  }

  @Public()
  @Post('forgot-password')
  forgotPassword(
    @Body('email') email: string,
  ): Observable<{ message: string }> {
    return this.client.send(Patterns.AUTH.FORGOT_PASSWORD, { email });
  }

  @Public()
  @Post('reset-password/:token')
  resetPassword(
    @Param('token') token: string,
    @Body('newPassword') newPassword: string,
  ): Observable<{ message: string }> {
    return this.client.send(Patterns.AUTH.RESET_PASSWORD, {
      token,
      newPassword,
    });
  }

  @Public()
  @Get('google')
  @UseGuards(GoogleAuthGuard)
  googleLogin() {}

  @Public()
  @Get('google/redirect')
  @UseGuards(GoogleAuthGuard)
  googleLoginCallback(@Req() req: Request): Observable<AuthResponse> {
    return this.client.send(Patterns.AUTH.SIGN_IN_GOOGLE, req.user);
  }

  @Post('logout')
  logout(
    @Body('refreshToken') refreshToken: string,
  ): Observable<{ message: string }> {
    return this.client.send(Patterns.AUTH.LOGOUT, { refreshToken });
  }

  @Post('logout-all')
  logoutAll(
    @CurrentUser('userId') userId: string,
  ): Observable<{ message: string }> {
    return this.client.send(Patterns.AUTH.LOGOUT_ALL, { userId });
  }
}
