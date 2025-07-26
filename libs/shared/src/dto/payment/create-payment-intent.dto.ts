import {
  IsCurrency,
  IsMongoId,
  IsNumber,
  IsPositive,
  IsNotEmpty,
} from 'class-validator';

export class CreatePaymentIntentDto {
  @IsNumber()
  @IsPositive()
  amount: number;

  @IsCurrency()
  @IsNotEmpty()
  currency: string;

  @IsMongoId()
  @IsNotEmpty()
  booking: string;
}
