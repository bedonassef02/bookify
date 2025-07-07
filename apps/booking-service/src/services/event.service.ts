import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { Patterns, RpcBadRequestException } from '@app/shared';

@Injectable()
export class EventService {
  constructor(@Inject('EVENT_SERVICE') private eventService: ClientProxy) {}

  findOne(id: string): Promise<any> {
    return firstValueFrom(
      this.eventService.send(Patterns.EVENTS.FIND_ONE, { id }),
    );
  }

  async getBookedSeats(id: string) {
    const event: any = await this.findOne(id);

    if (event.capacity <= event.bookedSeats) {
      throw new RpcBadRequestException(`Not enough available seats`);
    }

    return event.bookedSeats;
  }

  updateBookedSeats(id: string, seats: number): void {
    this.eventService.emit(Patterns.EVENTS.UPDATE, {
      id,
      eventDto: { bookedSeats: seats + 1 },
    });
  }
}
