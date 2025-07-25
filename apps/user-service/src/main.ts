import { AppModule } from './app.module';
import {
  RmqMicroserviceBootstrap,
  USERS_QUEUE,
  LoggerService,
} from '@app/shared';

async function bootstrap() {
  const app = await RmqMicroserviceBootstrap(AppModule, USERS_QUEUE);
  app.useLogger(app.get(LoggerService));
  await app.listen();
}
bootstrap();
