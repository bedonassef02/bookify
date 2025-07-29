import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { LoggingInterceptor, ExceptionFilter, Template } from '@app/shared';
import { ObjectSchema } from 'joi';

interface Options {
  validationSchema: ObjectSchema;
}

@Module({})
export class CoreModule {
  static forRoot(options: Options): DynamicModule {
    return {
      module: CoreModule,
      global: true,
      imports: [
        ConfigModule.forRoot({
          expandVariables: true,
          isGlobal: true,
          validationSchema: options.validationSchema,
        }),
        CacheModule.register(),
      ],
      providers: [
        Template,
        {
          provide: APP_INTERCEPTOR,
          useClass: LoggingInterceptor,
        },
        {
          provide: APP_FILTER,
          useClass: ExceptionFilter,
        },
      ],
      exports: [ConfigModule, CacheModule, Template],
    };
  }
}
