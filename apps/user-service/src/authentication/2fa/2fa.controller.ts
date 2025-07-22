import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuthResponse, Patterns, RpcUnauthorizedException } from '@app/shared';
import { TwoFactorAuthenticationService } from './2fa.service';
import { AuthenticationService } from '../authentication.service';

@Controller('2fa')
export class TwoFactorAuthenticationController {
  constructor(
    private readonly twoFactorAuthenticationService: TwoFactorAuthenticationService,
    private readonly authenticationService: AuthenticationService,
  ) {}

  @MessagePattern(Patterns.AUTH.GENERATE_2FA_SECRET)
  generateSecret(
    @Payload('id') id: string,
  ): Promise<{ secret: string; otpauthUrl: string }> {
    return this.twoFactorAuthenticationService.generateSecret(id);
  }

  @MessagePattern(Patterns.AUTH.ENABLE_2FA)
  enable(
    @Payload('id') id: string,
    @Payload('code') code: string,
  ): Promise<{ success: boolean }> {
    return this.twoFactorAuthenticationService.enable(id, code);
  }

  @MessagePattern(Patterns.AUTH.DISABLE_2FA)
  disable(@Payload('id') id: string): Promise<{ success: boolean }> {
    return this.twoFactorAuthenticationService.disable(id);
  }

  @MessagePattern(Patterns.AUTH.VERIFY_2FA)
  async verifyCode(
    @Payload('id') id: string,
    @Payload('code') code: string,
  ): Promise<AuthResponse> {
    const isValid = await this.twoFactorAuthenticationService.verifyCode(
      id,
      code,
    );
    if (isValid) {
      return this.authenticationService.generateTokensForUser(id);
    }
    throw new RpcUnauthorizedException('Invalid 2FA code');
  }

  @MessagePattern(Patterns.AUTH.VERIFY_2FA_SIGNIN)
  verifySignIn(
    @Payload('email') email: string,
    @Payload('code') code: string,
  ): Promise<AuthResponse> {
    return this.twoFactorAuthenticationService.verifySignIn(email, code);
  }
}
