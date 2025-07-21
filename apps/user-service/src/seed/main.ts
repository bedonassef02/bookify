import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { UserSeeder } from './seeder';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const userSeeder = app.get(UserSeeder);

  const args = process.argv.slice(2);
  const countIndex = args.indexOf('--count');
  const count = countIndex !== -1 ? parseInt(args[countIndex + 1], 10) : 10; // Default to 10 users

  await userSeeder.seed(count);

  await app.close();
}

bootstrap()
  .then(() => console.log('Seeding complete!'))
  .catch((error) => {
    console.error('Seeding failed:', error);
    process.exit(1);
  });
