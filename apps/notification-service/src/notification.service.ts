import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailDto } from '@app/shared';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { MAIL_QUEUE } from './mail-queue/mail.constants';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);
  private readonly email: string;
  constructor(
    @InjectQueue(MAIL_QUEUE) private readonly mailQueue: Queue<MailDto>,
    private readonly configService: ConfigService,
  ) {
    this.email = this.configService.get<string>('EMAIL_USER', '');
  }

  async sendMail(mailDto: MailDto) {
    mailDto.from = this.email;
    await this.mailQueue.add('send-email', mailDto);
    this.logger.log(`Email job added to queue for ${mailDto.to}`);
  }
}
