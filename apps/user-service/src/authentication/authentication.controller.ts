import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuthResponse, Patterns, SignInDto, SignUpDto } from '@app/shared';
import { AuthenticationService } from './authentication.service';
import { ChangePasswordDto } from '@app/shared/dto/user/change-password.dto';

@Controller('authentication')
export class AuthenticationController {
  constructor(private readonly authService: AuthenticationService) {}

  @MessagePattern(Patterns.AUTH.SIGN_UP)
  async signUp(signUpDto: SignUpDto): Promise<AuthResponse> {
    return this.authService.signUp(signUpDto);
  }

  @MessagePattern(Patterns.AUTH.SIGN_IN)
  async signIn(signInDto: SignInDto): Promise<AuthResponse> {
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
}
