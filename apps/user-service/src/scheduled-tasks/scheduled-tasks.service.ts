import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { TokenRepository } from '../repositories/token.repository';
import { RefreshTokenRepository } from '../repositories/refresh-token.repository';

@Injectable()
export class ScheduledTasksService {
  private readonly logger = new Logger(ScheduledTasksService.name);

  constructor(
    private readonly tokenRepository: TokenRepository,
    private readonly refreshTokenRepository: RefreshTokenRepository,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleCron() {
    this.logger.log('Running token cleanup cron job');
    await this.tokenRepository.deleteMany();
    await this.refreshTokenRepository.deleteMany();
    this.logger.log('Token cleanup cron job finished');
  }
}
