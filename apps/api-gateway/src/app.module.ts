import { Module } from '@nestjs/common';
import { EventsModule } from './events/events.module';
import { ImagesModule } from './common/image/images.module';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule } from '@nestjs/config';
import { ExceptionFilter } from './common/filters/exception.filter';
import { UsersModule } from './users/users.module';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { TimeoutInterceptor } from './common/interceptors/timeout.interceptor';
import { AuthModule } from './users/auth/auth.module';
import { JwtAuthGuard } from './users/auth/guards/auth.guard';
import { RolesGuard } from './users/auth/guards/roles.guard';
import { BookingModule } from './booking/booking.module';
import { ReviewModule } from './review/review.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { PaymentModule } from './payment/payment.module';
import { NotificationModule } from './notification/notification.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    CacheModule.register({
      isGlobal: true,
      ttl: 60000,
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 20,
      },
    ]),
    ImagesModule,
    EventsModule,
    UsersModule,
    AuthModule,
    BookingModule,
    PaymentModule,
    ReviewModule,
    NotificationModule,
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
    {
      provide: APP_INTERCEPTOR,
      useClass: TimeoutInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
