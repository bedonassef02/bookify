import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Model } from 'mongoose';
import { generateUniqueSlug } from '@app/shared';

@Schema({ timestamps: true })
export class Category extends Document {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true, unique: true })
  slug: string;

  @Prop()
  description: string;
}

export const CategorySchema = SchemaFactory.createForClass(Category);

CategorySchema.pre<Category>('save', async function (next) {
  if (this.isModified('name')) {
    this.slug = await generateUniqueSlug(
      this,
      this.constructor as Model<Category>,
      this.name,
    );
  }
  next();
});
