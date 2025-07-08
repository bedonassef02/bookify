import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { ClientModule, USER_SERVICE } from '@app/shared';

@Module({
  imports: [
    ClientModule.register({ name: USER_SERVICE, queue: 'users_queue' }),
  ],
  controllers: [UsersController],
})
export class UsersModule {}
