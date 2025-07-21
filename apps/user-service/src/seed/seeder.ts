import { Injectable } from '@nestjs/common';
import { UserService } from '../user.service';
import { HashingService } from '../hashing/hashing.service';
import { CreateUserDto } from '@app/shared';
import { Role } from '@app/shared';
import { faker } from '@faker-js/faker';

@Injectable()
export class UserSeeder {
  constructor(
    private readonly userService: UserService,
    private readonly hashingService: HashingService,
  ) {}

  async seed(count: number) {
    const usersToSeed: CreateUserDto[] = [];

    for (let i = 0; i < count; i++) {
      const firstName = faker.person.firstName();
      const lastName = faker.person.lastName();
      const email = faker.internet.email({ firstName, lastName });
      const password = 'password123';
      const phoneNumber = faker.phone.number();
      const role = faker.helpers.arrayElement([
        Role.USER,
        Role.USER,
        Role.USER,
        Role.ADMIN,
      ]);

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
        const existingUser = await this.userService.findByEmail(userData.email);
        if (existingUser) {
          console.log(
            `User with email ${userData.email} already exists. Skipping.`,
          );
          continue;
        }

        const hashedPassword = await this.hashingService.hash(
          userData.password,
        );
        await this.userService.create({
          ...userData,
          password: hashedPassword,
        });
        console.log(`User ${userData.email} seeded successfully.`);
      } catch (error) {
        console.error(`Error seeding user ${userData.email}:`, error.message);
      }
    }
  }
}
