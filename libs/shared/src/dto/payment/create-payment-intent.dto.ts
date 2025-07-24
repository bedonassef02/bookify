import { IsCurrency, IsMongoId, IsNumber } from 'class-validator';

export class CreatePaymentIntentDto {
  @IsNumber()
  amount: number;

  @IsCurrency()
  currency: string;

  @IsMongoId()
  bookingId: string;
}
