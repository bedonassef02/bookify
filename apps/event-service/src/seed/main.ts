import { NestFactory } from '@nestjs/core';
import { SeederModule } from './seeder.module';
import { EventSeeder } from './event.seeder';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(SeederModule);

  const eventSeeder = app.get(EventSeeder);

  const args = process.argv.slice(2);
  const countIndex = args.indexOf('--count');
  const count = countIndex !== -1 ? parseInt(args[countIndex + 1], 10) : 10; // Default to 10 events

  await eventSeeder.seed(count);

  await app.close();
}

bootstrap()
  .then(() => console.log('Seeding complete!'))
  .catch((error) => {
    console.error('Seeding failed:', error);
    process.exit(1);
  });
