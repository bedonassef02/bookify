import { Injectable } from '@nestjs/common';
import * as speakeasy from 'speakeasy';
import * as qrcode from 'qrcode';
import { RpcNotFoundException, RpcUnauthorizedException } from '@app/shared';
import { UserService } from '../../user.service';

@Injectable()
export class TwoFactorAuthenticationService {
  constructor(private readonly usersService: UserService) {}

  async generateTwoFactorAuthenticationSecret(
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

  async enableTwoFactorAuthentication(
    id: string,
    code: string,
  ): Promise<{ success: boolean }> {
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

  async disableTwoFactorAuthentication(
    id: string,
  ): Promise<{ success: boolean }> {
    const user = await this.usersService.findOne(id);
    if (!user) throw new RpcNotFoundException('User not found');

    await this.usersService.update(id, {
      isTwoFactorAuthenticationEnabled: false,
      twoFactorAuthenticationSecret: null,
    });

    return { success: true };
  }

  async verifyTwoFactorAuthenticationCode(
    id: string,
    code: string,
  ): Promise<boolean> {
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

    return true;
  }
}
