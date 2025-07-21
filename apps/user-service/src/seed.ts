import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UserService } from './user.service';
import { HashingService } from './hashing/hashing.service';
import { CreateUserDto } from '@app/shared';
import { Role } from '@app/shared';
import { faker } from '@faker-js/faker';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const userService = app.get(UserService);
  const hashingService = app.get(HashingService);

  const args = process.argv.slice(2);
  const countIndex = args.indexOf('--count');
  const count = countIndex !== -1 ? parseInt(args[countIndex + 1], 10) : 10; // Default to 10 users

  const usersToSeed: CreateUserDto[] = [];

  for (let i = 0; i < count; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const email = faker.internet.email({ firstName, lastName });
    const password = 'password123'; // You can make this random too if needed
    const phoneNumber = faker.phone.number();
    const role = faker.helpers.arrayElement([Role.USER, Role.USER, Role.USER, Role.ADMIN]); // More users than admins
    const verified = faker.datatype.boolean();

    usersToSeed.push({
      email,
      password,
      firstName,
      lastName,
      phoneNumber,
      role,
    });
  }

  for (const userData of usersToSeed) {
    try {
      const existingUser = await userService.findByEmail(userData.email);
      if (existingUser) {
        console.log(`User with email ${userData.email} already exists. Skipping.`);
        continue;
      }

      const hashedPassword = await hashingService.hash(userData.password);
      await userService.create({ ...userData, password: hashedPassword });
      console.log(`User ${userData.email} seeded successfully.`);
    } catch (error) {
      console.error(`Error seeding user ${userData.email}:`, error.message);
    }
  }

  await app.close();
}

bootstrap()
  .then(() => console.log('Seeding complete!'))
  .catch((error) => {
    console.error('Seeding failed:', error);
    process.exit(1);
  });