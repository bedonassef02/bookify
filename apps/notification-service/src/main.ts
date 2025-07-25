import { AppModule } from './app.module';
import {
  RmqMicroserviceBootstrap,
  NOTIFICATION_QUEUE,
  LoggerService,
} from '@app/shared';

async function bootstrap() {
  const app = await RmqMicroserviceBootstrap(AppModule, NOTIFICATION_QUEUE);
  app.useLogger(app.get(LoggerService));
  await app.listen();
}
bootstrap();
