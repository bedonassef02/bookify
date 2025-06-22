import { Injectable } from '@nestjs/common';

@Injectable()
export class EventService {
  findAll(): [] {
    return [];
  }

  findOne(id: string): string {
    return `Event #${id}`;
  }
}
