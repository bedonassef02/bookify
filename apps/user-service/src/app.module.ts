import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { CacheModule } from '@nestjs/cache-manager';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './entities/user.entity';
import { UserRepository } from './repositories/user.repository';
import { HashingService } from './hashing/hashing.service';
import { BcryptService } from './hashing/bcrypt.service';
import { AuthenticationService } from './authentication/authentication.service';
import { AuthenticationController } from './authentication/authentication.controller';
import {
  DatabaseModule,
  JwtModule,
  CoreModule,
  ClientModule,
  NOTIFICATION_SERVICE,
  LoggerModule,
  MetricsModule,
} from '@app/shared';
import { TokenService } from './services/token.service';
import { UserController } from './user.controller';
import { PasswordService } from './services/password.service';
import { CredentialsService } from './services/credentials.service';
import { NotificationService } from './mailer/notification.service';
import { Token, TokenSchema } from './entities/token.entity';
import { TokenRepository } from './repositories/token.repository';
import {
  RefreshToken,
  RefreshTokenSchema,
} from './entities/refresh-token.entity';
import { RefreshTokenRepository } from './repositories/refresh-token.repository';
import { TwoFactorAuthenticationService } from './authentication/2fa/2fa.service';
import { TwoFactorAuthenticationController } from './authentication/2fa/2fa.controller';
import { ScheduledTasksModule } from './scheduled-tasks/scheduled-tasks.module';

@Module({
  imports: [
    CoreModule.forRoot(),
    JwtModule,
    ScheduledTasksModule,
    CacheModule.register(),
    DatabaseModule.register({ dbName: 'userdb' }),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Token.name, schema: TokenSchema },
      { name: RefreshToken.name, schema: RefreshTokenSchema },
    ]),
    ClientModule.register({
      name: NOTIFICATION_SERVICE,
      queue: 'notification_queue',
    }),
    LoggerModule,
    MetricsModule,
  ],
  providers: [
    UserService,
    UserRepository,
    {
      provide: HashingService,
      useClass: BcryptService,
    },
    AuthenticationService,
    TokenService,
    TokenRepository,
    RefreshTokenRepository,
    PasswordService,
    CredentialsService,
    NotificationService,
    TwoFactorAuthenticationService,
  ],
  controllers: [
    UserController,
    AuthenticationController,
    TwoFactorAuthenticationController,
  ],
})
export class AppModule {}
