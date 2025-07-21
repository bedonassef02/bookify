import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { MailDto, NOTIFICATION_SERVICE, Patterns, Template } from '@app/shared';

@Injectable()
export class NotificationService {
  constructor(
    @Inject(NOTIFICATION_SERVICE) private notificationService: ClientProxy,
    private template: Template,
  ) {
    this.template.setPath(__dirname + '/mailer/templates');
  }

  cancel(emails: string | string[], event: string): void {
    const mailDto: MailDto = {
      to: emails,
      subject: 'Booking Cancelled',
      html: this.template.compile('booking-cancelled.hbs', {
        name: event,
      }),
    };

    this.notificationService.emit(Patterns.NOTIFICATIONS.SEND_EMAIL, mailDto);
  }
}
