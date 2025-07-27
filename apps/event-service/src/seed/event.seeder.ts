import { Injectable } from '@nestjs/common';
import { CreateEventDto, EventStatus } from '@app/shared';
import { faker } from '@faker-js/faker';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category } from '../entities/category.entity';
import { Event } from '../entities/event.entity';

@Injectable()
export class EventSeeder {
  constructor(
    @InjectModel(Event.name) private readonly eventModel: Model<Event>,
    @InjectModel(Category.name) private readonly categoryModel: Model<Category>,
  ) {}

  async seed(count: number): Promise<Event[]> {
    const categories = await this.categoryModel.find();
    if (categories.length === 0) {
      console.log('No categories found. Please seed categories first.');
      return [];
    }

    const events: Event[] = [];
    for (let i = 0; i < count; i++) {
      events.push(
        await this.eventModel.create(this.createEventDto(categories)),
      );
    }

    return events;
  }

  private createEventDto(categories: Category[]): CreateEventDto {
    return {
      title: faker.lorem.sentence(),
      description: faker.lorem.paragraph(),
      date: faker.date.future(),
      duration: faker.number.int({ min: 1, max: 5 }),
      location: faker.location.city(),
      status: EventStatus.DRAFT,
      category: categories[
        faker.number.int({ min: 0, max: categories.length - 1 })
      ]._id as string,
    };
  }
}
