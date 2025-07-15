import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Repository } from '@app/shared';
import { UserPreference } from '../entities/user-preference.entity';

@Injectable()
export class UserPreferenceRepository extends Repository<UserPreference> {
  constructor(
    @InjectModel(UserPreference.name) preferenceModel: Model<UserPreference>,
  ) {
    super(preferenceModel);
  }

  findOrCreate(email: string): Promise<UserPreference> {
    return this.model.findOneAndUpdate(
      { email },
      { $setOnInsert: { email } },
      { upsert: true, new: true },
    );
  }
}
