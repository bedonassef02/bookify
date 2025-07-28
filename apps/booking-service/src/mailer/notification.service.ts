import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { MailDto, NOTIFICATION_SERVICE, Patterns, Template } from '@app/shared';
import { ConfirmData } from '../interfaces/confirm-data-template.interface';
import { Booking } from '../entities/booking.entity';

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

  confirm(email: string, event: string, booking: Booking): void {
    const mailDto: MailDto = {
      to: email,
      subject: 'Booking Confirmed',
      html: this.template.compile('booking-confirmed.hbs', {
        name: event,
        price: booking.totalPrice,
      } as ConfirmData),
    };

    this.notificationService.emit(Patterns.NOTIFICATIONS.SEND_EMAIL, mailDto);
  }
}
