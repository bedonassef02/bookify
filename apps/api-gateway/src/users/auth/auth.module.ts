import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtAuthGuard } from './guards/auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { ClientModule, JwtModule, USER_SERVICE } from '@app/shared';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    JwtModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    ClientModule.register({ name: USER_SERVICE, queue: 'users_queue' }),
  ],
  providers: [JwtStrategy, JwtAuthGuard, RolesGuard],
  controllers: [AuthController],
  exports: [JwtModule, JwtStrategy, JwtAuthGuard, RolesGuard],
})
export class AuthModule {}
