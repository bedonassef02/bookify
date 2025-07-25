import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Repository } from '@app/shared';
import { Token, TokenType } from '../entities/token.entity';

@Injectable()
export class TokenRepository extends Repository<Token> {
  constructor(@InjectModel(Token.name) tokenModel: Model<Token>) {
    super(tokenModel);
  }

  async deleteOne(userId: string, type: TokenType): Promise<void> {
    await this.model.deleteOne({ userId, type }).exec();
  }
}
