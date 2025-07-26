import {
  IsString,
  IsNumber,
  IsNotEmpty,
  Min,
  Max,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReviewDto {
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
  @IsOptional()
  @IsString()
  comment?: string;

  event: string;
  user: string;
}
