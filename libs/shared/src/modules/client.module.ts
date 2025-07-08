import { DynamicModule, Module } from '@nestjs/common';
import {
  ClientsModule,
  Transport,
  ClientsModuleAsyncOptions,
} from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';

interface Options {
  name: string | symbol;
  queue: string;
}

@Module({})
export class ClientModule {
  static register(options: Options | Options[]): DynamicModule {
    if (!Array.isArray(options)) {
      options = [options];
    }

    const clients: ClientsModuleAsyncOptions = options.map(
      (option: Options) => {
        return {
          name: option.name,
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
              queue: option.queue,
              queueOptions: {
                durable: false,
              },
              socketOptions: {
                connectionTimeout: 5000,
                heartbeatIntervalInSeconds: 30,
              },
            },
          }),
        };
      },
    );
    return {
      module: ClientModule,
      imports: [ClientsModule.registerAsync(clients)],
      exports: [ClientsModule],
    };
  }
}
