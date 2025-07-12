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

  updatePassword(password: string): void {
    this.version++;
    this.lastPassword = password;
    const now = dayjs().unix();
    this.passwordUpdatedAt = now;
    this.updatedAt = now;
  }

  updateVersion(): void {
    this.version++;
    this.updatedAt = dayjs().unix();
  }
}

export const CredentialsSchema = SchemaFactory.createForClass(Credentials);
