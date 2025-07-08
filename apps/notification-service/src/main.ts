import { AppModule } from './app.module';
import { RmqMicroserviceBootstrap } from '@app/shared';

async function bootstrap() {
  const app = await RmqMicroserviceBootstrap(AppModule, 'notification_queue');

  await app.listen();
}
bootstrap();
