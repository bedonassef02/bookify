import { AppModule } from './app.module';
import { RmqMicroserviceBootstrap, NOTIFICATION_QUEUE } from '@app/shared';

async function bootstrap() {
  const app = await RmqMicroserviceBootstrap(AppModule, NOTIFICATION_QUEUE);

  await app.listen();
}
bootstrap();
