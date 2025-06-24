import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtAuthGuard } from './guards/auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { JwtModule } from '@app/shared';

@Module({
  imports: [PassportModule.register({ defaultStrategy: 'jwt' }), JwtModule],
  providers: [JwtStrategy, JwtAuthGuard, RolesGuard],
  exports: [JwtModule, JwtStrategy, JwtAuthGuard, RolesGuard],
})
export class AuthModule {}
