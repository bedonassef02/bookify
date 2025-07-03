import { Controller } from '@nestjs/common';
import { UserService } from './user.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { Patterns } from '@app/shared';
import { UserDocument } from './entities/user.entity';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern(Patterns.USERS.FIND_ONE)
  findOne(id: string): Promise<UserDocument> {
    return this.userService.findOne(id);
  }

  @MessagePattern(Patterns.USERS.FIND_EMAILS_BY_IDS)
  findEmailsByIds(@Payload('ids') ids: string[]): Promise<string[]> {
    return this.userService.findEmailsByIds(ids);
  }
}
