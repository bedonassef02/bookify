import { Module } from '@nestjs/common';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import {
  CoreModule,
  DatabaseModule,
  LoggerModule,
  MetricsModule,
} from '@app/shared';
import { MongooseModule } from '@nestjs/mongoose';
import {
  UserPreference,
  UserPreferenceSchema,
} from './entities/user-preference.entity';
import {
  Notification,
  NotificationSchema,
} from './entities/notification.entity';
import { NotificationRepository } from './repositories/notification.repository';
import { UserPreferenceRepository } from './repositories/user-preference.repository';
import { MailQueueModule } from './mail-queue/mail-queue.module';

@Module({
  imports: [
    CoreModule.forRoot(),
    DatabaseModule.register({ dbName: 'notificationdb' }),
    MongooseModule.forFeature([
      { name: Notification.name, schema: NotificationSchema },
      { name: UserPreference.name, schema: UserPreferenceSchema },
    ]),
    MailQueueModule,
    LoggerModule,
    MetricsModule,
  ],
  controllers: [NotificationController],
  providers: [
    NotificationService,
    NotificationRepository,
    UserPreferenceRepository,
  ],
})
export class AppModule {}
