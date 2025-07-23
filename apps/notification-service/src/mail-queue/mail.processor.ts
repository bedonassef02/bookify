import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { MAIL_QUEUE } from './mail.constants';
import { MailerService } from '@nestjs-modules/mailer';
import { MailDto } from '@app/shared';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Processor(MAIL_QUEUE)
export class MailProcessor extends WorkerHost {
  private readonly logger = new Logger(MailProcessor.name);
  private readonly email: string;

  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {
    super();
    this.email = this.configService.get<string>('EMAIL_USER', '');
  }

  async process(job: Job<MailDto, any, string>): Promise<any> {
    this.logger.log(`Processing job ${job.id} of type ${job.name}`);
    const mailDto = job.data;
    mailDto.from = this.email;

    try {
      if (Array.isArray(mailDto.to)) {
        for (const recipient of mailDto.to) {
          await this.mailerService.sendMail({ ...mailDto, to: recipient });
        }
      } else {
        await this.mailerService.sendMail(mailDto);
      }
      this.logger.log(`Email sent for job ${job.id}`);
    } catch (error) {
      this.logger.error(
        `Failed to send email for job ${job.id}: ${error.message}`,
      );
      throw error; // Re-throw to mark the job as failed
    }
  }
}
