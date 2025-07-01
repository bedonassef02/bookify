import { IsInt, IsMongoId, IsOptional, Min } from 'class-validator';

export class BookDto {
  @IsOptional()
  user: string;

  @IsMongoId()
  event: string;

  @IsInt()
  @Min(1)
  seats: number;
}
