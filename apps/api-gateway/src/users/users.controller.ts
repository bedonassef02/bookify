import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AuthResponse, PATTERNS, SignInDto, SignUpDto } from '@app/shared';
import { Observable } from 'rxjs';

@Controller('users')
export class UsersController {
  constructor(@Inject('USER_SERVICE') private client: ClientProxy) {}

  @Post('sign-up')
  signUp(@Body() signUpDto: SignUpDto): Observable<AuthResponse> {
    return this.client.send(PATTERNS.USERS.SIGN_UP, signUpDto);
  }

  @Post('sign-in')
  signIn(@Body() signInDto: SignInDto): Observable<AuthResponse> {
    return this.client.send(PATTERNS.USERS.SIGN_IN, signInDto);
  }
}
