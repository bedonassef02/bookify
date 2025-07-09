import { Controller } from '@nestjs/common';
import { UserService } from './user.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { Patterns, QueryDto, UserType } from '@app/shared';
import { UserDocument } from './entities/user.entity';
import { ChangePasswordDto } from '@app/shared/dto/user/change-password.dto';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern(Patterns.USERS.FIND_ALL)
  findAll(@Payload() query: QueryDto): Promise<UserDocument[]> {
    return this.userService.findAll(query);
  }

  @MessagePattern(Patterns.USERS.FIND_ONE)
  findOne(@Payload('id') id: string): Promise<UserType> {
    return this.userService.findOne(id);
  }

  @MessagePattern(Patterns.USERS.FIND_EMAILS_BY_IDS)
  findEmailsByIds(@Payload('ids') ids: string[]): Promise<string[]> {
    return this.userService.findEmailsByIds(ids);
  }

  @MessagePattern(Patterns.USERS.CHANGE_PASSWORD)
  changePassword(
    @Payload('id') id: string,
    @Payload('passwordDto') passwordDto: ChangePasswordDto,
  ): Promise<boolean> {
    return this.userService.changePassword(id, passwordDto);
  }
}
