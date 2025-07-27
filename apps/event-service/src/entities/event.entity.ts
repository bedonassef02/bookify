import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Model, Types } from 'mongoose';
import { Category } from './category.entity';
import { EventStatus, generateUniqueSlug } from '@app/shared';

@Schema({ timestamps: true })
export class Event extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  date: Date;

  @Prop({ required: true, default: 1 })
  duration: number;

  @Prop({ required: true })
  location: string;

  @Prop({
    type: String,
    enum: Object.values(EventStatus),
    default: EventStatus.DRAFT,
  })
  status: EventStatus;

  @Prop({ unique: true })
  slug: string;

  @Prop({ type: [String], default: [] })
  imageIds: string[];

  @Prop()
  featuredImageId?: string;

  @Prop({ type: Types.ObjectId, ref: 'Category' })
  category: Category;
}

export const EventSchema = SchemaFactory.createForClass(Event);

EventSchema.pre<Event>('save', async function (next) {
  if (this.isModified('title')) {
    this.slug = await generateUniqueSlug(
      this,
      this.constructor as Model<Event>,
      this.title,
    );
  }
  next();
});
