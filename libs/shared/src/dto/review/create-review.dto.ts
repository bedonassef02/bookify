import { IsString, IsNumber, IsNotEmpty, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReviewDto {
  @ApiProperty({ description: 'The ID of the user making the review' })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ description: 'The ID of the event being reviewed' })
  @IsString()
  @IsNotEmpty()
  eventId: string;

  @ApiProperty({
    description: 'The rating given to the event (1-5)',
    minimum: 1,
    maximum: 5,
  })
  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiProperty({ description: 'Optional comment for the review' })
  @IsString()
  comment?: string;
}
