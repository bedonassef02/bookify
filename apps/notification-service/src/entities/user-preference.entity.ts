import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserPreferenceDocument = UserPreference & Document;

export class UserPreference {
  @Prop({ unique: true })
  email: string;

  @Prop({ type: Boolean, default: false })
  useEmail: boolean;

  @Prop({ type: Boolean, default: false })
  useSms: boolean;

  @Prop({ type: Boolean, default: true })
  usePush: boolean;
}

export const UserPreferenceSchema =
  SchemaFactory.createForClass(UserPreference);
