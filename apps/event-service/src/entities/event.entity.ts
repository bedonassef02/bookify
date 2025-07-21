import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Model } from 'mongoose';
import slugify from 'slugify';

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

  @Prop({ required: true, min: 1 })
  capacity: number;

  @Prop({ required: true, default: 0 })
  bookedSeats: number;

  @Prop({ default: false })
  isActive: boolean;

  @Prop({ unique: true })
  slug: string;

  @Prop({ type: [String], default: [] })
  imageIds: string[];

  @Prop()
  featuredImageId?: string;
}

export const EventSchema = SchemaFactory.createForClass(Event);

EventSchema.pre<Event>('save', async function (next) {
  if (!this.isModified('title')) return next();

  const baseSlug = slugify(this.title, { lower: true, strict: true });
  let slug = baseSlug;
  let count = 1;

  const Model = this.constructor as Model<Event>;
  while (await Model.exists({ slug, _id: { $ne: this._id } })) {
    slug = `${baseSlug}-${count++}`;
  }

  this.slug = slug;
  next();
});
