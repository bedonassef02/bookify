import { AppModule } from './app.module';
import {
  RmqMicroserviceBootstrap,
  EVENTS_QUEUE,
  LoggerService,
} from '@app/shared';

async function bootstrap() {
  const app = await RmqMicroserviceBootstrap(AppModule, EVENTS_QUEUE);
  app.useLogger(app.get(LoggerService));
  await app.listen();
}
bootstrap();
