import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtAuthGuard } from './guards/auth.guard';
import { RolesGuard } from './guards/roles.guard';
import {
  ClientModule,
  JwtModule,
  USER_SERVICE,
  USERS_QUEUE,
} from '@app/shared';
import { AuthController } from './auth.controller';
import { GoogleStrategy } from './strategies/google.strategy';
import { TwoFactorAuthenticationController } from './2fa/2fa.controller';

@Module({
  imports: [
    JwtModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    ClientModule.register({ name: USER_SERVICE, queue: USERS_QUEUE }),
  ],
  providers: [JwtStrategy, JwtAuthGuard, RolesGuard, GoogleStrategy],
  controllers: [AuthController, TwoFactorAuthenticationController],
  exports: [JwtModule, JwtStrategy, JwtAuthGuard, RolesGuard],
})
export class AuthModule {}
