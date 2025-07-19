import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Notification extends Document {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  message: string;

  @Prop({ type: Boolean, default: false })
  isRead: boolean;

  @Prop()
  actionUrl?: string;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
