import { Controller } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { MessagePattern } from '@nestjs/microservices';
import { UserDocument } from '../entities/user.entity';
import { PATTERNS, SignInDto } from '@app/shared';

@Controller('authentication')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @MessagePattern(PATTERNS.USERS.SIGN_UP)
  async signUp(signUpDto: any): Promise<UserDocument> {
    return this.authenticationService.signUp(signUpDto);
  }

  @MessagePattern(PATTERNS.USERS.SIGN_IN)
  async signIn(signInDto: SignInDto): Promise<UserDocument> {
    return this.authenticationService.signIn(signInDto);
  }
}
