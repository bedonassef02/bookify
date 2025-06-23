import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { LoggingInterceptor } from '@app/shared/interceptors/logging.interceptor';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [process.env.RABBITMQ_URL ?? 'amqp://localhost:5672'],
        queue: 'events_queue',
        queueOptions: {
          durable: false,
        },
      },
    },
  );

  app.useGlobalInterceptors(new LoggingInterceptor());

  await app.listen();
}
bootstrap();
