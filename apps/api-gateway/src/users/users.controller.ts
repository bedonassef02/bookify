import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AuthResponse, Patterns, SignInDto, SignUpDto } from '@app/shared';
import { Observable } from 'rxjs';
import { Public } from './auth/decorators/public.decorator';

@Controller('users')
export class UsersController {
  constructor(@Inject('USER_SERVICE') private client: ClientProxy) {}

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
}
