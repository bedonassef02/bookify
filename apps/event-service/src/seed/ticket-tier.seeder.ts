import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TicketTier } from '../entities/ticket-tier.entity';
import { faker } from '@faker-js/faker';
import { CreateTicketTierDto } from '@app/shared';
import { Event } from '../entities/event.entity';

@Injectable()
export class TicketTierSeeder {
  constructor(
    @InjectModel(TicketTier.name)
    private readonly ticketTierModel: Model<TicketTier>,
  ) {}

  async seed(events: Event[]) {
    const ticketTiers: CreateTicketTierDto[] = [];
    for (const event of events) {
      const ticketTierCount = faker.number.int({ min: 1, max: 3 });
      for (let i = 0; i < ticketTierCount; i++) {
        ticketTiers.push(this.createTicketTier(event._id as string));
      }
    }
    await this.ticketTierModel.insertMany(ticketTiers);
  }

  private createTicketTier(eventId: string): CreateTicketTierDto {
    return {
      name: faker.commerce.productName(),
      price: faker.number.int({ min: 10, max: 100 }),
      capacity: faker.number.int({ min: 50, max: 200 }),
      event: eventId,
    };
  }
}
