import { Module } from '@nestjs/common';
import { EventsModule } from './events/events.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { RpcExceptionInterceptor } from './common/interceptors/rpc-exception.interceptor';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    CacheModule.register({
      isGlobal: true,
      ttl: 60000,
    }),
    EventsModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: RpcExceptionInterceptor,
    },
  ],
})
export class AppModule {}
