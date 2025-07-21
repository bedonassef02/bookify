import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class CreateTicketTierDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsNumber()
  @Min(1)
  capacity: number;

  @IsString()
  @IsNotEmpty()
  event: string;
}
