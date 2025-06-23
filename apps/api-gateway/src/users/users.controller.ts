import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { PATTERNS, SignUpDto } from '@app/shared';

@Controller('users')
export class UsersController {
  constructor(@Inject('USER_SERVICE') private client: ClientProxy) {}

  @Post('sign-up')
  signUp(@Body() signUpDto: SignUpDto) {
    return this.client.send(PATTERNS.USERS.SIGN_UP, signUpDto);
  }
}
