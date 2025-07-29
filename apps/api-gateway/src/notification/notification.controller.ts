import { Controller, Get, Inject, Param, Put } from '@nestjs/common';
import { CurrentUser } from '../users/auth/decorators/current-user.decorator';
import { NOTIFICATION_SERVICE, Patterns } from '@app/shared';
import { ClientProxy } from '@nestjs/microservices';

@Controller({ path: 'notifications', version: '1' })
export class NotificationController {
  constructor(
    @Inject(NOTIFICATION_SERVICE) private notificationService: ClientProxy,
  ) {}

  @Get()
  findAll(@CurrentUser('userId') userId: string) {
    return this.notificationService.send(
      Patterns.NOTIFICATIONS.FIND_ALL,
      userId,
    );
  }

  @Put(':id/read')
  markAsRead(@Param('id') id: string) {
    return this.notificationService.send(Patterns.NOTIFICATIONS.MARK_AS_READ, {
      id,
    });
  }
}
