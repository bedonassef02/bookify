import { AppModule } from './app.module';
import { RmqMicroserviceBootstrap, BOOKING_QUEUE } from '@app/shared';

async function bootstrap() {
  const app = await RmqMicroserviceBootstrap(AppModule, BOOKING_QUEUE);

  await app.listen();
}
bootstrap();
