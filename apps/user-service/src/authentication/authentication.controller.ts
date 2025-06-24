import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AuthResponse, Patterns, SignInDto, SignUpDto } from '@app/shared';
import { AuthenticationService } from './authentication.service';
import { TokenService } from '../services/token.service';

@Controller('authentication')
export class AuthenticationController {
  constructor(
    private readonly auth: AuthenticationService,
    private readonly tokenService: TokenService,
  ) {}

  @MessagePattern(Patterns.USERS.SIGN_UP)
  async signUp(signUpDto: SignUpDto): Promise<AuthResponse> {
    return this.auth.signUp(signUpDto);
  }

  @MessagePattern(Patterns.USERS.SIGN_IN)
  async signIn(signInDto: SignInDto): Promise<AuthResponse> {
    return this.auth.signIn(signInDto);
  }

  @MessagePattern(Patterns.USERS.VALIDATE_TOKEN)
  async validateToken(data: { token: string }): Promise<any> {
    return this.tokenService.validate(data.token);
  }
}
