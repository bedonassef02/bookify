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
  generateTwoFactorAuthenticationSecret(
    @Payload('id') id: string,
  ): Promise<{ secret: string; otpauthUrl: string }> {
    return this.twoFactorAuthenticationService.generateTwoFactorAuthenticationSecret(
      id,
    );
  }

  @MessagePattern(Patterns.AUTH.ENABLE_2FA)
  enableTwoFactorAuthentication(
    @Payload('id') id: string,
    @Payload('code') code: string,
  ): Promise<{ success: boolean }> {
    return this.twoFactorAuthenticationService.enableTwoFactorAuthentication(
      id,
      code,
    );
  }

  @MessagePattern(Patterns.AUTH.DISABLE_2FA)
  disableTwoFactorAuthentication(
    @Payload('id') id: string,
  ): Promise<{ success: boolean }> {
    return this.twoFactorAuthenticationService.disableTwoFactorAuthentication(
      id,
    );
  }

  @MessagePattern(Patterns.AUTH.VERIFY_2FA)
  verifyTwoFactorAuthenticationCode(
    @Payload('id') id: string,
    @Payload('code') code: string,
  ): Promise<boolean> {
    // Changed return type to boolean as per 2fa.service.ts
    return this.twoFactorAuthenticationService.verifyTwoFactorAuthenticationCode(
      id,
      code,
    );
  }
}
