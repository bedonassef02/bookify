import { Controller } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { MailDto, Patterns } from '@app/shared';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @MessagePattern(Patterns.NOTIFICATIONS.SEND_EMAIL)
  sendMail(mailDto: MailDto) {
    return this.notificationService.sendMail(mailDto);
  }
}
