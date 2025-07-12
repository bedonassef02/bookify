import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Role } from '@app/shared';
import { Credentials, CredentialsSchema } from './credentials.entity';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop()
  phoneNumber?: string;

  @Prop({ default: Role.USER })
  role: string;

  @Prop({ default: false })
  verified: boolean;

  @Prop({ type: CredentialsSchema, default: () => ({}) })
  credentials: Credentials;
}

export const UserSchema = SchemaFactory.createForClass(User);
