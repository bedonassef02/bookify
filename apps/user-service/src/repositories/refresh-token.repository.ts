import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RefreshToken } from '../entities/refresh-token.entity';
import { Repository } from '@app/shared';

@Injectable()
export class RefreshTokenRepository extends Repository<RefreshToken> {
  constructor(@InjectModel(RefreshToken.name) model: Model<RefreshToken>) {
    super(model);
  }

  findOne(token: string): Promise<RefreshToken | null> {
    return this.model.findOne({ token }).exec();
  }

  deleteOne(token: string): Promise<any> {
    return this.model.deleteOne({ token }).exec();
  }

  deleteManyByUserId(userId: string): Promise<any> {
    return this.model.deleteMany({ userId }).exec();
  }
}
