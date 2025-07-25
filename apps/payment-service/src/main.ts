import { AppModule } from './app.module';
import {
  RmqMicroserviceBootstrap,
  PAYMENT_QUEUE,
  LoggerService,
} from '@app/shared';

async function bootstrap() {
  const app = await RmqMicroserviceBootstrap(AppModule, PAYMENT_QUEUE);
  app.useLogger(app.get(LoggerService));
  await app.listen();
}
bootstrap();
