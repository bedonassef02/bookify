import { Module } from '@nestjs/common';
import { EventsController } from './events.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'EVENT_SERVICE',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [
              configService.get<string>(
                'RABBITMQ_URL',
                'amqp://localhost:5672',
              ),
            ],
            queue: 'events_queue',
            queueOptions: {
              durable: false,
            },
            socketOptions: {
              connectionTimeout: 5000,
              heartbeatIntervalInSeconds: 30,
            },
          },
        }),
      },
    ]),
  ],
  controllers: [EventsController],
})
export class EventsModule {}
