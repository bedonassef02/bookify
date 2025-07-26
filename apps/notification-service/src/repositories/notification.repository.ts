import { Repository } from '@app/shared';
import { Injectable, Logger } from '@nestjs/common';
import { Notification } from '../entities/notification.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class NotificationRepository extends Repository<Notification> {
  protected readonly logger = new Logger(NotificationRepository.name);

  constructor(
    @InjectModel(Notification.name) notificationModel: Model<Notification>,
  ) {
    super(notificationModel);
  }
}
