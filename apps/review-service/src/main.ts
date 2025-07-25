import { AppModule } from './app.module';
import {
  RmqMicroserviceBootstrap,
  REVIEW_QUEUE,
  LoggerService,
} from '@app/shared';

async function bootstrap() {
  const app = await RmqMicroserviceBootstrap(AppModule, REVIEW_QUEUE);
  app.useLogger(app.get(LoggerService));
  await app.listen();
}
bootstrap();
