import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  Patterns,
  EVENT_SERVICE,
  CreateTicketTierDto,
  UpdateTicketTierDto,
} from '@app/shared';
import { ParseMongoIdPipe } from '../../common/pipes/parse-mongo-id.pipe';

@Controller({ path: 'events/:eventId/ticket-tiers', version: '1' })
export class TicketTiersController {
  constructor(@Inject(EVENT_SERVICE) private client: ClientProxy) {}

  @Post()
  create(
    @Param('eventId', ParseMongoIdPipe) event: string,
    @Body() createTicketTierDto: CreateTicketTierDto,
  ) {
    createTicketTierDto.event = event;
    return this.client.send(Patterns.TICKET_TIERS.CREATE, createTicketTierDto);
  }

  @Get()
  findAll(@Param('eventId', ParseMongoIdPipe) eventId: string) {
    return this.client.send(Patterns.TICKET_TIERS.FIND_ALL, { event: eventId });
  }

  @Get(':id')
  findOne(@Param('id', ParseMongoIdPipe) id: string) {
    return this.client.send(Patterns.TICKET_TIERS.FIND_ONE, { id });
  }

  @Patch(':id')
  update(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() updateTicketTierDto: UpdateTicketTierDto,
  ) {
    return this.client.send(Patterns.TICKET_TIERS.UPDATE, {
      id,
      updateTicketTierDto,
    });
  }

  @Delete(':id')
  remove(@Param('id', ParseMongoIdPipe) id: string) {
    return this.client.send(Patterns.TICKET_TIERS.REMOVE, { id });
  }
}
