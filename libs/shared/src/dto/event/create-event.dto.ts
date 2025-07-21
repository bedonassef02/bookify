import {
  IsString,
  IsDateString,
  IsNumber,
  IsNotEmpty,
  Min,
  Max,
  IsMongoId,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsFutureDate } from '@app/shared/decorators';
import { EventStatus } from '@app/shared/enums/events/event-status.enum';

export class CreateEventDto {
  @ApiProperty({
    description: 'The title of the event',
    example: 'Tech Conference 2024',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Detailed description of the event',
    example:
      'Annual technology conference featuring talks on AI, Cloud, and Web3',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'Event date and time in ISO 8601 format',
    example: '2024-12-25T10:00:00Z',
  })
  @IsDateString()
  @IsNotEmpty()
  @IsFutureDate()
  date: Date;

  @ApiProperty({
    description: 'Event duration in hours',
    example: 1,
    minimum: 1,
    maximum: 6,
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(6)
  duration: Date;

  @ApiProperty({
    description: 'Event location',
    example: 'Convention Center, San Francisco, CA',
  })
  @IsString()
  @IsNotEmpty()
  location: string;

  @ApiProperty({
    description: 'The category of the event',
    example: '60f1b9b3b3b3b3b3b3b3b3b3',
  })
  @IsMongoId()
  @IsOptional()
  category: string;

  @ApiProperty({
    description: 'The status of the event',
    enum: EventStatus,
    example: EventStatus.DRAFT,
  })
  @IsEnum(EventStatus)
  @IsOptional()
  status: EventStatus;

  @ApiProperty({
    description: 'Array of ticket tier IDs associated with the event',
    type: [String],
    example: ['60f1b9b3b3b3b3b3b3b3b3b3', '60f1b9b3b3b3b3b3b3b3b3b4'],
  })
  @IsMongoId({ each: true })
  @IsOptional()
  ticketTiers: string[];
}
