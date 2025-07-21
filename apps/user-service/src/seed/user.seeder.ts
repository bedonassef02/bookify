import { Injectable } from '@nestjs/common';
import { UserService } from '../user.service';
import { HashingService } from '../hashing/hashing.service';
import { CreateUserDto, Role } from '@app/shared';
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
      usersToSeed.push(this.createUserDto());
    }

    for (const userData of usersToSeed) {
      try {
        await this.isExist(userData.email);

        const password = await this.hashingService.hash(userData.password);
        await this.userService.create({ ...userData, password });
        console.log(`User ${userData.email} seeded successfully.`);
      } catch (error) {
        console.error(`Error seeding user ${userData.email}:`, error.message);
      }
    }
  }

  private createUserDto(): CreateUserDto {
    return {
      email: faker.internet.email(),
      password: 'password123',
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      phoneNumber: faker.phone.number(),
      role: Role.USER,
    };
  }

  private async isExist(email: string) {
    const user = await this.userService.findByEmail(email);
    if (user) {
      console.log(`User with email ${email} already exists. Skipping.`);
    }
  }
}
