import { Injectable } from '@nestjs/common';
import * as speakeasy from 'speakeasy';
import * as qrcode from 'qrcode';
import {
  AuthResponse,
  RpcNotFoundException,
  RpcUnauthorizedException,
} from '@app/shared';
import { UserService } from '../../user.service';
import { TokenService } from '../../services/token.service';

@Injectable()
export class TwoFactorAuthenticationService {
  constructor(
    private readonly usersService: UserService,
    private readonly tokenService: TokenService,
  ) {}

  async generateSecret(
    id: string,
  ): Promise<{ secret: string; otpauthUrl: string }> {
    const user = await this.usersService.findOne(id);
    if (!user) throw new RpcNotFoundException('User not found');

    const secret = speakeasy.generateSecret({
      name: 'Bookify',
      issuer: 'Bookify',
    });

    if (!secret.otpauth_url) {
      throw new Error('Failed to generate OTPAuth URL.');
    }
    const otpauthUrl = await qrcode.toDataURL(secret.otpauth_url);

    await this.usersService.update(id, {
      twoFactorAuthenticationSecret: secret.base32,
    });

    return {
      secret: secret.base32,
      otpauthUrl,
    };
  }

  async enable(id: string, code: string): Promise<{ success: boolean }> {
    const user = await this.usersService.findOne(id);
    if (!user) throw new RpcNotFoundException('User not found');

    if (!user.twoFactorAuthenticationSecret) {
      throw new RpcUnauthorizedException('2FA is not set up for this user.');
    }

    const verified = speakeasy.totp.verify({
      secret: user.twoFactorAuthenticationSecret,
      encoding: 'base32',
      token: code,
    });

    if (!verified) {
      throw new RpcUnauthorizedException(
        'Invalid two-factor authentication code',
      );
    }

    await this.usersService.update(id, {
      isTwoFactorAuthenticationEnabled: true,
    });

    return { success: true };
  }

  async disable(id: string): Promise<{ success: boolean }> {
    const user = await this.usersService.findOne(id);
    if (!user) throw new RpcNotFoundException('User not found');

    await this.usersService.update(id, {
      isTwoFactorAuthenticationEnabled: false,
      twoFactorAuthenticationSecret: null,
    });

    return { success: true };
  }

  async verifyCode(id: string, code: string): Promise<boolean> {
    const user = await this.usersService.findOne(id);
    if (!user) throw new RpcNotFoundException('User not found');

    if (!user.twoFactorAuthenticationSecret) {
      throw new RpcUnauthorizedException('2FA is not set up for this user.');
    }

    if (!user.isTwoFactorAuthenticationEnabled) {
      throw new RpcUnauthorizedException('2FA is not enabled for this user.');
    }

    const verified = speakeasy.totp.verify({
      secret: user.twoFactorAuthenticationSecret,
      encoding: 'base32',
      token: code,
      window: 2, // Allow for time drift
    });

    if (!verified) {
      throw new RpcUnauthorizedException(
        'Invalid two-factor authentication code',
      );
    }

    return true;
  }

  async verifySignIn(email: string, code: string): Promise<AuthResponse> {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new RpcNotFoundException('User not found');

    if (!user.twoFactorAuthenticationSecret) {
      throw new RpcUnauthorizedException('2FA is not set up for this user.');
    }

    if (!user.isTwoFactorAuthenticationEnabled) {
      throw new RpcUnauthorizedException('2FA is not enabled for this user.');
    }

    const verified = speakeasy.totp.verify({
      secret: user.twoFactorAuthenticationSecret,
      encoding: 'base32',
      token: code,
      window: 2, // Allow for time drift
    });

    if (!verified) {
      throw new RpcUnauthorizedException(
        'Invalid two-factor authentication code',
      );
    }

    const tokens = await this.tokenService.generate(user); // Generate tokens after successful 2FA verification
    return {
      user: this.usersService.sanitize(user),
      tokens,
    };
  }
}
