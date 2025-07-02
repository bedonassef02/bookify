import { Module } from '@nestjs/common';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      expandVariables: true,
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        transport: {
          service: configService.get<string>('SERVICE_NAME'),
          auth: {
            user: configService.get<string>('EMAIL_ADDRESS'),
            pass: configService.get<string>('EMAIL_PASSWORD'),
          },
          tls: {
            rejectUnauthorized: false,
          },
        },
      }),
    }),
  ],
  controllers: [NotificationController],
  providers: [NotificationService],
})
export class AppModule {}
