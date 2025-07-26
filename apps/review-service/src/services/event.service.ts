import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { EVENT_SERVICE, EventType, Patterns } from '@app/shared';

@Injectable()
export class EventService {
  constructor(@Inject(EVENT_SERVICE) private eventService: ClientProxy) {}

  findOne(id: string): Promise<EventType> {
    return firstValueFrom(
      this.eventService.send(Patterns.EVENTS.FIND_ONE, { id }),
    );
  }
}
