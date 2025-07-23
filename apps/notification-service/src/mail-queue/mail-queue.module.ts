import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { MailProcessor } from './mail.processor';
import { MAIL_QUEUE } from './mail.constants';
import { MailerModule } from '@nestjs-modules/mailer';
import mailConfig from '../config/mail.config';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        connection: {
          host: configService.get<string>('REDIS_HOST', 'localhost'),
          port: configService.get<number>('REDIS_PORT', 6379),
        },
      }),
      inject: [ConfigService],
    }),
    BullModule.registerQueue({
      name: MAIL_QUEUE,
    }),
    MailerModule.forRootAsync(mailConfig.asProvider()),
    ConfigModule,
  ],
  providers: [MailProcessor],
  exports: [BullModule],
})
export class MailQueueModule {}
