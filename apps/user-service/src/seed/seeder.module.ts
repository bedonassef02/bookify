import { Module } from '@nestjs/common';
import { CoreModule, DatabaseModule } from '@app/shared';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../entities/user.entity';
import { UserSeeder } from './user.seeder';
import { HashingService } from '../hashing/hashing.service';
import { BcryptService } from '../hashing/bcrypt.service';

@Module({
  imports: [
    CoreModule.forRoot(),
    DatabaseModule.register({ dbName: 'userdb' }),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [
    UserSeeder,
    {
      provide: HashingService,
      useClass: BcryptService,
    },
  ],
})
export class SeederModule {}
