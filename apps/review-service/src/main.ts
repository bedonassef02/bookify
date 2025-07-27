import { AppModule } from './app.module';
import { RmqMicroserviceBootstrap, REVIEW_QUEUE } from '@app/shared';

async function bootstrap() {
  const app = await RmqMicroserviceBootstrap(AppModule, REVIEW_QUEUE);

  await app.listen();
}
bootstrap();
