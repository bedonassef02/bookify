import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { Patterns } from '@app/shared';
import { TwoFactorAuthenticationService } from './2fa.service';

@Controller('2fa')
export class TwoFactorAuthenticationController {
  constructor(
    private readonly twoFactorAuthenticationService: TwoFactorAuthenticationService,
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
  verifyCode(
    @Payload('id') id: string,
    @Payload('code') code: string,
  ): Promise<boolean> {
    return this.twoFactorAuthenticationService.verifyCode(id, code);
  }
}
