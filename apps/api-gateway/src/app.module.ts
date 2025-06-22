import { Module } from '@nestjs/common';
import { EventsModule } from './events/events.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { RpcExceptionInterceptor } from './common/interceptors/rpc-exception.interceptor';

@Module({
  imports: [EventsModule],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: RpcExceptionInterceptor,
    },
  ],
})
export class AppModule {}
