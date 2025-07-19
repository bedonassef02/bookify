import { Module } from '@nestjs/common';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { CoreModule, DatabaseModule } from '@app/shared';
import { MongooseModule } from '@nestjs/mongoose';
import {
  UserPreference,
  UserPreferenceSchema,
} from './entities/user-preference.entity';
import { UserPreferenceRepository } from './repositories/user-preference.repository';
import mailConfig from './config/mail.config';

@Module({
  imports: [
    CoreModule.forRoot(),
    DatabaseModule.register({ dbName: 'notificationdb' }),
    MongooseModule.forFeature([
      { name: UserPreference.name, schema: UserPreferenceSchema },
    ]),
    MailerModule.forRootAsync(mailConfig.asProvider()),
  ],
  controllers: [NotificationController],
  providers: [NotificationService, UserPreferenceRepository],
})
export class AppModule {}
