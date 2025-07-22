import { NestFactory } from '@nestjs/core';
import { SeederModule } from './seeder.module';
import { EventSeeder } from './event.seeder';
import { CategorySeeder } from './category.seeder';
import { TicketTierSeeder } from './ticket-tier.seeder';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(SeederModule);

  const categorySeeder = app.get(CategorySeeder);
  const eventSeeder = app.get(EventSeeder);
  const ticketTierSeeder = app.get(TicketTierSeeder);

  const args = process.argv.slice(2);
  const countIndex = args.indexOf('--count');
  const count = countIndex !== -1 ? parseInt(args[countIndex + 1], 10) : 10; // Default to 10

  await categorySeeder.seed(count);
  const events = await eventSeeder.seed(count);
  await ticketTierSeeder.seed(events);

  await app.close();
}

bootstrap()
  .then(() => console.log('Seeding complete!'))
  .catch((error) => {
    console.error('Seeding failed:', error);
    process.exit(1);
  });
