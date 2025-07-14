import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { MailDto } from '@app/shared';
import { ITemplatedData } from './interfaces/template-data.interface';
import { readFileSync } from 'fs';
import Handlebars from 'handlebars';
import { join } from 'path';
import { ITemplates } from './interfaces/templates.interface';

@Injectable()
export class NotificationService {
  private email: string;
  private readonly templates: ITemplates;

  constructor(
    private readonly mailService: MailerService,
    private readonly configService: ConfigService,
  ) {
    this.email = this.configService.get<string>('EMAIL_USER', '');
    this.templates = {
      confirmation: this.parseTemplate('confirmation.hbs'),
    };
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

  private parseTemplate(
    templateName: string,
  ): Handlebars.TemplateDelegate<ITemplatedData> {
    const templateText = readFileSync(
      join(__dirname, 'templates', templateName),
      'utf-8',
    );
    return Handlebars.compile<ITemplatedData>(templateText, { strict: true });
  }
}
