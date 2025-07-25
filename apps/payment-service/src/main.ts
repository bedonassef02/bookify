import { AppModule } from './app.module';
import { RmqMicroserviceBootstrap, PAYMENT_QUEUE } from '@app/shared';

async function bootstrap() {
  const app = await RmqMicroserviceBootstrap(AppModule, PAYMENT_QUEUE);

  await app.listen();
}
bootstrap();
