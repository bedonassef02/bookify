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

  async sendMail(mailDto: MailDto) {
    mailDto.from = this.email;
    if (Array.isArray(mailDto.to)) {
      for (let i = 0; i < mailDto.to.length; i++) {
        await this.mailService.sendMail({ ...mailDto, to: mailDto.to[i] });
      }
      return;
    }
    await this.mailService.sendMail(mailDto);
  }
}
