import { Module } from '@nestjs/common';
import { CorrelationIdInterceptor } from './correlation.interceptor';
import { LoggerModule } from '@app/shared/logger';

@Module({
  imports: [LoggerModule],
  providers: [CorrelationIdInterceptor],
  exports: [CorrelationIdInterceptor],
})
export class InterceptorsModule {}
