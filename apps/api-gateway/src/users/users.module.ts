import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { ClientModule } from '../common/modules/client.module';

@Module({
  imports: [
    ClientModule.register({ name: 'USER_SERVICE', queue: 'users_queue' }),
  ],
  controllers: [UsersController],
})
export class UsersModule {}
