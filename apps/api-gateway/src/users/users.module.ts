import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { ClientModule } from '@app/shared';

@Module({
  imports: [
    ClientModule.register({ name: 'USER_SERVICE', queue: 'users_queue' }),
  ],
  controllers: [UsersController],
})
export class UsersModule {}
