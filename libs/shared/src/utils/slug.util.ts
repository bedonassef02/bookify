import { Document, Model } from 'mongoose';
import slugify from 'slugify';

export async function generateUniqueSlug<T extends Document>(
  doc: T,
  model: Model<T>,
  title: string,
): Promise<string> {
  if (!title) {
    return '';
  }
  const baseSlug = slugify(title, { lower: true, strict: true });
  let slug = baseSlug;
  let count = 1;

  while (await model.exists({ slug, _id: { $ne: doc._id } })) {
    slug = `${baseSlug}-${count++}`;
  }
  return slug;
}
