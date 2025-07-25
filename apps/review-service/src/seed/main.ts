import { NestFactory } from '@nestjs/core';
import { SeederModule } from './seeder.module';
import { ReviewSeeder } from './review.seeder';

async function bootstrap() {
  const appContext = await NestFactory.createApplicationContext(SeederModule);
  const reviewSeeder = appContext.get(ReviewSeeder);

  try {
    await reviewSeeder.seed();
    console.log('Review seeding complete!');
  } catch (error) {
    console.error('Review seeding failed!', error);
  } finally {
    await appContext.close();
  }
}
bootstrap();
