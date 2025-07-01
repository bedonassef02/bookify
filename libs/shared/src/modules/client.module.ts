import { DynamicModule, Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';

interface Options {
  name: string;
  queue: string;
}

@Module({})
export class ClientModule {
  static register(options: Options): DynamicModule {
    return {
      module: ClientModule,
      imports: [
        ClientsModule.registerAsync([
          {
            name: options.name,
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
                queue: options.queue,
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
      exports: [ClientsModule],
    };
  }
}
