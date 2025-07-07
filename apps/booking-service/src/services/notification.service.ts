import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { MailDto, Patterns } from '@app/shared';

@Injectable()
export class NotificationService {
  constructor(
    @Inject('NOTIFICATION_SERVICE') private notificationService: ClientProxy,
  ) {}

  cancel(emails: string | string[], event: string): void {
    const mailDto: MailDto = {
      to: emails,
      subject: 'Booking Cancelled',
      text: `Your booking for event ${event} has been cancelled.`,
    };

    this.notificationService.emit(Patterns.NOTIFICATIONS.SEND_EMAIL, mailDto);
  }
}
