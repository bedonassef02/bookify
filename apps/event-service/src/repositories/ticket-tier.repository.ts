import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Repository } from '@app/shared';
import { TicketTier } from '../entities/ticket-tier.entity';

@Injectable()
export class TicketTierRepository extends Repository<TicketTier> {
  constructor(
    @InjectModel(TicketTier.name) ticketTierModel: Model<TicketTier>,
  ) {
    super(ticketTierModel);
  }

  async updateBookedSeats(
    id: string,
    increment: number,
  ): Promise<TicketTier | null> {
    return this.model
      .findByIdAndUpdate(
        id,
        { $inc: { bookedSeats: increment } },
        { new: true },
      )
      .exec();
  }
}
