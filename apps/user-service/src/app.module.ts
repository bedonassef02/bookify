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
import { DatabaseModule, JwtModule, CoreModule } from '@app/shared';
import { TokenService } from './services/token.service';
import { UserController } from './user.controller';
import { PasswordService } from './services/password.service';
import { Credentials, CredentialsSchema } from './entities/credentials.entity';

@Module({
  imports: [
    CoreModule.forRoot(),
    JwtModule,
    CacheModule.register(),
    DatabaseModule.register({ dbName: 'userdb' }),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Credentials.name, schema: CredentialsSchema },
    ]),
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
    PasswordService,
  ],
  controllers: [UserController, AuthenticationController],
})
export class AppModule {}
