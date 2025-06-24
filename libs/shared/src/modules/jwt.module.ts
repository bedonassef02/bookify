import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule as NestJwtModule } from '@nestjs/jwt';
import { Jwt } from '@app/shared';

@Module({
  imports: [
    NestJwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>(Jwt.SECRET, 'secret'),
        signOptions: {
          expiresIn: configService.get<string>(Jwt.ACCESS_TOKEN_TTL, '15m'),
        },
      }),
    }),
  ],
})
export class JwtModule {}
