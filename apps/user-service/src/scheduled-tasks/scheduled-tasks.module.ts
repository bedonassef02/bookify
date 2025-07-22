import { Module } from '@nestjs/common';
import { ScheduledTasksService } from './scheduled-tasks.service';
import { TokenRepository } from '../repositories/token.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Token, TokenSchema } from '../entities/token.entity';
import {
  RefreshToken,
  RefreshTokenSchema,
} from '../entities/refresh-token.entity';
import { RefreshTokenRepository } from '../repositories/refresh-token.repository';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Token.name, schema: TokenSchema },
      { name: RefreshToken.name, schema: RefreshTokenSchema },
    ]),
    JwtModule,
  ],
  providers: [ScheduledTasksService, TokenRepository, RefreshTokenRepository],
  exports: [ScheduledTasksService],
})
export class ScheduledTasksModule {}
