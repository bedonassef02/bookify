import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { ClientModule, USER_SERVICE, USERS_QUEUE } from '@app/shared';
import { CloudinaryModule } from '@app/file-storage';

@Module({
  imports: [
    CloudinaryModule,
    ClientModule.register({ name: USER_SERVICE, queue: USERS_QUEUE }),
  ],
  controllers: [UsersController],
})
export class UsersModule {}
