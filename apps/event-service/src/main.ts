import { AppModule } from './app.module';
import { RmqMicroserviceBootstrap, EVENTS_QUEUE } from '@app/shared';

async function bootstrap() {
  const app = await RmqMicroserviceBootstrap(AppModule, EVENTS_QUEUE);

  await app.listen();
}
bootstrap();
