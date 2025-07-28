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
}
