import { AppModule } from './app.module';
import { RmqMicroserviceBootstrap, USERS_QUEUE } from '@app/shared';

async function bootstrap() {
  const app = await RmqMicroserviceBootstrap(AppModule, USERS_QUEUE);

  await app.listen();
}
bootstrap();
