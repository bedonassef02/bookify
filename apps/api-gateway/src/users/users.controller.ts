import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  AuthResponse,
  Patterns,
  SignInDto,
  SignUpDto,
  USER_SERVICE,
  UserType,
} from '@app/shared';
import { Observable } from 'rxjs';
import { Public } from './auth/decorators/public.decorator';
import { CurrentUser } from './auth/decorators/current-user.decorator';

@Controller('users')
export class UsersController {
  constructor(@Inject(USER_SERVICE) private client: ClientProxy) {}

  @Public()
  @Post('sign-up')
  signUp(@Body() signUpDto: SignUpDto): Observable<AuthResponse> {
    return this.client.send(Patterns.USERS.SIGN_UP, signUpDto);
  }

  @Public()
  @Post('sign-in')
  signIn(@Body() signInDto: SignInDto): Observable<AuthResponse> {
    return this.client.send(Patterns.USERS.SIGN_IN, signInDto);
  }

  @Get('me')
  me(@CurrentUser('userId') id: string): Observable<UserType> {
    return this.client.send(Patterns.USERS.FIND_ONE, { id });
  }
}
