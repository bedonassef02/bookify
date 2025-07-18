import { Inject, Injectable } from '@nestjs/common';
import { join } from 'path';
import {
  ITemplatedData,
  MailDto,
  NOTIFICATION_SERVICE,
  parseTemplate,
  Patterns,
} from '@app/shared';
import { ConfigService } from '@nestjs/config';
import { ClientProxy } from '@nestjs/microservices';
import { User } from '../entities/user.entity';

@Injectable()
export class NotificationService {
  private readonly domain: string;
  constructor(
    @Inject(NOTIFICATION_SERVICE) private notificationService: ClientProxy,
    configService: ConfigService,
  ) {
    this.domain = configService.get<string>('DOMAIN') as string;
  }

  sendConfirmation(user: User, token: string) {
    const mailDto: MailDto = {
      to: user.email,
      subject: 'Confirm your account',
      html: this.compile('confirmation.hbs', {
        name: user.firstName,
        link: `http://${this.domain}/auth/confirm/${token}`,
      }),
    };

    this.notificationService.emit(Patterns.NOTIFICATIONS.SEND_EMAIL, mailDto);
  }

  sendPasswordReset(user: User, token: string) {
    const mailDto: MailDto = {
      to: user.email,
      subject: 'Reset your password',
      html: this.compile('reset-password.hbs', {
        name: user.firstName,
        link: `http://${this.domain}/auth/reset-password/${token}`,
      }),
    };

    this.notificationService.emit(Patterns.NOTIFICATIONS.SEND_EMAIL, mailDto);
  }

  sendPasswordChangeSuccess(user: User) {
    const mailDto: MailDto = {
      to: user.email,
      subject: 'Password change successful',
      html: this.compile('password-change-success.hbs', {
        name: user.firstName,
      }),
    };

    this.notificationService.emit(Patterns.NOTIFICATIONS.SEND_EMAIL, mailDto);
  }

  private compile(templateName: string, data: ITemplatedData): string {
    const template = parseTemplate(
      join(__dirname, 'mailer/templates', templateName),
    );

    return template(data);
  }
}
