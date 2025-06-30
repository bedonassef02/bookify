import {
  IsString,
  IsDateString,
  IsNumber,
  IsNotEmpty,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsFutureDate } from '@app/shared/decorators';

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
    description: 'Event location',
    example: 'Convention Center, San Francisco, CA',
  })
  @IsString()
  @IsNotEmpty()
  location: string;

  @ApiProperty({
    description: 'Maximum number of attendees',
    example: 500,
    minimum: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  capacity: number;

  @ApiProperty({
    description: 'MongoDB ObjectId of the event organizer',
    example: '507f1f77bcf86cd799439011',
  })
  @IsString()
  @IsNotEmpty()
  organizerId: string;
}
