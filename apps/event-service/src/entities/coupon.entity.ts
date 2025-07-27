import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { DiscountType } from '@app/shared';

export type CouponDocument = Coupon & Document;

@Schema({ timestamps: true })
export class Coupon {
  @Prop({ required: true, unique: true })
  code: string;

  @Prop({ required: true, enum: DiscountType, type: String })
  discountType: DiscountType;

  @Prop({ required: true })
  value: number; // e.g., 10 for 10% or $10

  @Prop({ required: false })
  expiryDate?: Date;

  @Prop()
  usageLimit: number; // Total number of times this coupon can be used

  @Prop({ default: 0 })
  usedCount: number; // How many times this coupon has been used

  @Prop({ type: [Types.ObjectId], ref: 'Event', default: [] })
  applicableEvents: string[]; // Event IDs this coupon applies to

  @Prop({ type: [Types.ObjectId], ref: 'Category', default: [] })
  applicableCategories: string[]; // Category IDs this coupon applies to

  @Prop({ default: 0 })
  minPurchaseAmount: number; // Minimum purchase amount for the coupon to be valid
}

export const CouponSchema = SchemaFactory.createForClass(Coupon);
