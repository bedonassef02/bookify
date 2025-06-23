import { Module } from '@nestjs/common';
import { EventsModule } from './events/events.module';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule } from '@nestjs/config';
import { ExceptionFilter } from './common/filters/exception.filter';
import { UsersModule } from './users/users.module';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    CacheModule.register({
      isGlobal: true,
      ttl: 60000,
    }),
    EventsModule,
    UsersModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: ExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule {}
