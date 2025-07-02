import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { MailDto } from '@app/shared';

@Injectable()
export class NotificationService {
  private email: string;
  constructor(
    private readonly mailService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  onModuleInit() {
    this.email = this.configService.get<string>('EMAIL_ADDRESS', '');
  }

  sendMail(mailDto: MailDto) {
    mailDto.from = this.email;
    return this.mailService.sendMail(mailDto);
  }
}
