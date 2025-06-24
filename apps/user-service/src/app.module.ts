import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './entities/user.entity';
import { UserRepository } from './repositories/user.repository';
import { HashingService } from './hashing/hashing.service';
import { BcryptService } from './hashing/bcrypt.service';
import { AuthenticationService } from './authentication/authentication.service';
import { AuthenticationController } from './authentication/authentication.controller';
import { DatabaseModule, JwtModule } from '@app/shared';
import { TokenService } from './services/token.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      expandVariables: true,
    }),
    JwtModule,
    CacheModule.register(),
    DatabaseModule.register({ dbName: 'userdb' }),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
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
  ],
  controllers: [AuthenticationController],
})
export class AppModule {}
