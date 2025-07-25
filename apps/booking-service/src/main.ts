import { AppModule } from './app.module';
import {
  RmqMicroserviceBootstrap,
  BOOKING_QUEUE,
  LoggerService,
} from '@app/shared';

async function bootstrap() {
  const app = await RmqMicroserviceBootstrap(AppModule, BOOKING_QUEUE);
  app.useLogger(app.get(LoggerService));
  await app.listen();
}
bootstrap();
