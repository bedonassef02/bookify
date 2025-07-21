import { PartialType } from '@nestjs/mapped-types';
import { CreateTicketTierDto } from '@app/shared/dto';

export class UpdateTicketTierDto extends PartialType(CreateTicketTierDto) {}
