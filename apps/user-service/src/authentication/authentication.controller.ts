import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AuthResponse, PATTERNS, SignInDto } from '@app/shared';
import { AuthenticationService } from './authentication.service';

@Controller('authentication')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @MessagePattern(PATTERNS.USERS.SIGN_UP)
  async signUp(signUpDto: any): Promise<AuthResponse> {
    return this.authenticationService.signUp(signUpDto);
  }

  @MessagePattern(PATTERNS.USERS.SIGN_IN)
  async signIn(signInDto: SignInDto): Promise<AuthResponse> {
    return this.authenticationService.signIn(signInDto);
  }

  @MessagePattern(PATTERNS.USERS.VALIDATE_TOKEN)
  async validateToken(data: { token: string }): Promise<any> {
    return this.authenticationService.validateToken(data.token);
  }
}
