import { Injectable } from '@nestjs/common';
import { HashingService } from '../hashing/hashing.service';
import { CreateUserDto, Role } from '@app/shared';
import { faker } from '@faker-js/faker';
import { Model } from 'mongoose';
import { User } from '../entities/user.entity';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class UserSeeder {
  constructor(
    private readonly hashingService: HashingService,
    @InjectModel(User.name) private readonly userModel: Model<User>,
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
        await this.userModel.create({ ...userData, password });
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
    const user = await this.userModel.findOne({ email });
    if (user) {
      console.log(`User with email ${email} already exists. Skipping.`);
    }
  }
}
