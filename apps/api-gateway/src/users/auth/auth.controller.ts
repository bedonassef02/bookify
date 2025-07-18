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
} from '@nestjs/common';
import {
  AuthResponse,
  Patterns,
  SignInDto,
  SignUpDto,
  USER_SERVICE,
  ChangePasswordDto,
} from '@app/shared';
import { ClientProxy } from '@nestjs/microservices';
import { Public } from './decorators/public.decorator';
import { Observable } from 'rxjs';
import { CurrentUser } from './decorators/current-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(@Inject(USER_SERVICE) private client: ClientProxy) {}

  @Public()
  @Post('sign-in')
  @HttpCode(HttpStatus.OK)
  signIn(@Body() signInDto: SignInDto): Observable<AuthResponse> {
    return this.client.send(Patterns.AUTH.SIGN_IN, signInDto);
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
}
