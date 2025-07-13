import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import dayjs from 'dayjs';
import { Document } from 'mongoose';

@Schema({ _id: false })
export class Credentials extends Document {
  @Prop({ default: 0 })
  version: number;

  @Prop({ default: '' })
  lastPassword: string;

  @Prop({ default: () => dayjs().unix() })
  passwordUpdatedAt: number;

  @Prop({ default: () => dayjs().unix() })
  updatedAt: number;
}

export const CredentialsSchema = SchemaFactory.createForClass(Credentials);
