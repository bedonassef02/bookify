import { AppModule } from './app.module';
import { RmqMicroserviceBootstrap } from '@app/shared/bootstrap';

async function bootstrap() {
  const app = await RmqMicroserviceBootstrap(AppModule, 'users_queue');

  await app.listen();
}
bootstrap();
