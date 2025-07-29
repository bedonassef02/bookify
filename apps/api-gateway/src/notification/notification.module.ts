import { Module } from '@nestjs/common';
import { NotificationController } from './notification.controller';
import {
  ClientModule,
  NOTIFICATION_QUEUE,
  NOTIFICATION_SERVICE,
} from '@app/shared';

@Module({
  imports: [
    ClientModule.register({
      name: NOTIFICATION_SERVICE,
      queue: NOTIFICATION_QUEUE,
    }),
  ],
  controllers: [NotificationController],
})
export class NotificationModule {}
