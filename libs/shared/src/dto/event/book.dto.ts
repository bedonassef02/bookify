import { IsMongoId, IsOptional } from 'class-validator';

export class BookDto {
  @IsOptional()
  user: string;

  @IsMongoId()
  event: string;

  @IsMongoId()
  ticketTier: string;

  @IsOptional()
  couponCode?: string;
}
