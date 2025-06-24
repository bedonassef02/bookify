import { DynamicModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';

interface Options {
  dbName: string;
  connectionName?: string;
}

@Module({})
export class DatabaseModule {
  static register(options: Options): DynamicModule {
    return {
      module: DatabaseModule,
      imports: [
        MongooseModule.forRootAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          connectionName: options.connectionName,
          useFactory: (configService: ConfigService) => ({
            uri: configService.get<string>(
              'MONGODB_URI',
              'mongodb://localhost:27017',
            ),
            dbName: options.dbName,
            retryAttempts: 3,
            retryDelay: 1000,
          }),
        }),
      ],
      exports: [MongooseModule],
    };
  }
}
