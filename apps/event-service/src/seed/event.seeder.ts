import { Injectable } from '@nestjs/common';
import { CreateEventDto, EventStatus } from '@app/shared';
import { faker } from '@faker-js/faker';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category } from '../entities/category.entity';
import { TicketTier } from '../entities/ticket-tier.entity';

@Injectable()
export class EventSeeder {
  constructor(
    @InjectModel(Event.name) private readonly eventModel: Model<Event>,
    @InjectModel(Category.name) private readonly categoryModel: Model<Category>,
    @InjectModel(TicketTier.name)
    private readonly ticketTierModel: Model<TicketTier>,
  ) {}

  async seed(count: number) {
    const categories = await this.categoryModel.find();
    if (categories.length === 0) {
      console.log('No categories found. Please seed categories first.');
      return;
    }

    for (let i = 0; i < count; i++) {
      const eventDto = this.createEventDto(categories);
      const event = await this.eventModel.create(eventDto);

      const ticketTierCount = faker.number.int({ min: 1, max: 3 });
      for (let j = 0; j < ticketTierCount; j++) {
        const ticketTierDto = this.createTicketTierDto(event.id);
        await this.ticketTierModel.create(ticketTierDto);
      }
    }
  }

  private createEventDto(categories): CreateEventDto {
    return {
      title: faker.lorem.sentence(),
      description: faker.lorem.paragraph(),
      date: faker.date.future(),
      duration: faker.number.int({ min: 1, max: 5 }),
      location: faker.location.city(),
      status: EventStatus.DRAFT,
      category:
        categories[faker.number.int({ min: 0, max: categories.length - 1 })].id,
    };
  }

  private createTicketTierDto(eventId: string) {
    return {
      name: faker.commerce.productName(),
      price: faker.number.int({ min: 10, max: 100 }),
      capacity: faker.number.int({ min: 50, max: 200 }),
      event: eventId,
    };
  }
}
