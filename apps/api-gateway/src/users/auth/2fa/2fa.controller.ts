import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Patterns, TwoFactorAuthenticationCodeDto } from '@app/shared';
import { CurrentUser } from '../decorators/current-user.decorator';
import { Inject } from '@nestjs/common';
import { USER_SERVICE } from '@app/shared';
import { Observable } from 'rxjs';
import { AuthResponse } from '@app/shared';
import { Public } from '../decorators/public.decorator';

@Controller('2fa')
export class TwoFactorAuthenticationController {
  constructor(@Inject(USER_SERVICE) private client: ClientProxy) {}

  @Post('generate')
  generateSecret(
    @CurrentUser('userId') id: string,
  ): Observable<{ secret: string; otpauthUrl: string }> {
    return this.client.send(Patterns.AUTH.GENERATE_2FA_SECRET, { id });
  }

  @Post('enable')
  enable(
    @CurrentUser('userId') id: string,
    @Body() { code }: TwoFactorAuthenticationCodeDto,
  ): Observable<{ success: boolean }> {
    return this.client.send(Patterns.AUTH.ENABLE_2FA, { id, code });
  }

  @Post('disable')
  disable(@CurrentUser('userId') id: string): Observable<{ success: boolean }> {
    return this.client.send(Patterns.AUTH.DISABLE_2FA, { id });
  }

  @Post('verify')
  verify(
    @CurrentUser('userId') id: string,
    @Body() { code }: TwoFactorAuthenticationCodeDto,
  ): Observable<AuthResponse> {
    return this.client.send(Patterns.AUTH.VERIFY_2FA, { id, code });
  }

  @Public()
  @Post('verify-signin')
  @HttpCode(HttpStatus.OK)
  verifySignIn(
    @Body() { email, code }: { email: string; code: string },
  ): Observable<AuthResponse> {
    return this.client.send(Patterns.AUTH.VERIFY_2FA_SIGNIN, { email, code });
  }
}
