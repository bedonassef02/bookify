import { Module } from '@nestjs/common';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CoreModule, DatabaseModule } from '@app/shared';
import { MongooseModule } from '@nestjs/mongoose';
import {
  UserPreference,
  UserPreferenceSchema,
} from './entities/user-preference.entity';

@Module({
  imports: [
    CoreModule.forRoot(),
    DatabaseModule.register({ dbName: 'notificationdb' }),
    MongooseModule.forFeature([
      { name: UserPreference.name, schema: UserPreferenceSchema },
    ]),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        transport: {
          service: configService.get<string>('SERVICE_NAME'),
          auth: {
            user: configService.get<string>('EMAIL_ADDRESS'),
            pass: configService.get<string>('EMAIL_PASSWORD'),
          },
          tls: {
            rejectUnauthorized: false,
          },
        },
      }),
    }),
  ],
  controllers: [NotificationController],
  providers: [NotificationService],
})
export class AppModule {}
