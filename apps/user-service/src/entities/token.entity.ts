import { Document } from 'mongoose';
import { Prop, SchemaFactory } from '@nestjs/mongoose';

export enum TokenType {
  CONFIRM = 'confirm',
  RESET = 'reset',
}

export class Token extends Document {
  @Prop({ required: true, enum: TokenType })
  type: TokenType;

  @Prop({ required: true })
  token: string;

  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  expiresAt: Date;
}

export const TokenSchema = SchemaFactory.createForClass(Token);
