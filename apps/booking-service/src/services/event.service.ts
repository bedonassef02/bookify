import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import {
  EVENT_SERVICE,
  EventStatus,
  EventType,
  Patterns,
  RpcBadRequestException,
} from '@app/shared';

@Injectable()
export class EventService {
  constructor(@Inject(EVENT_SERVICE) private eventService: ClientProxy) {}

  async _process(id: string): Promise<EventType> {
    const event: EventType = await this.findOne(id);
    this.validate(event);
    return event;
  }

  findOne(id: string): Promise<EventType> {
    return firstValueFrom(
      this.eventService.send(Patterns.EVENTS.FIND_ONE, { id }),
    );
  }

  private validate(event: EventType): void {
    if (event.date <= new Date()) {
      throw new RpcBadRequestException('Cannot book tickets for past events');
    }

    if (event.status !== EventStatus.PUBLISHED) {
      throw new RpcBadRequestException(
        'Cannot book tickets for an event that is not published.',
      );
    }
  }
}
