import { Controller } from '@nestjs/common';
import { UserService } from './user.service';
import { MessagePattern } from '@nestjs/microservices';
import { Patterns } from '@app/shared';
import { UserDocument } from './entities/user.entity';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern(Patterns.USERS.FIND_ONE)
  findOne(id: string): Promise<UserDocument> {
    return this.userService.findOne(id);
  }
}
