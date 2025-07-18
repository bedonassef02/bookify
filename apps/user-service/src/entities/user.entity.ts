import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Role } from '@app/shared';
import { Credentials } from './credentials.entity';

@Schema({ timestamps: true })
export class User extends Document {
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

  @Prop()
  credentials: Credentials;

  @Prop()
  confirmationToken?: string;

  @Prop()
  confirmationTokenExpiry?: Date;

  @Prop()
  resetPasswordToken?: string;

  @Prop()
  resetPasswordTokenExpiry?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
