import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Payment, PaymentDocument } from '../entities/payment.entity';
import { Repository } from '@app/shared';

@Injectable()
export class PaymentRepository extends Repository<PaymentDocument> {
  constructor(@InjectModel(Payment.name) paymentModel: Model<PaymentDocument>) {
    super(paymentModel);
  }
}
