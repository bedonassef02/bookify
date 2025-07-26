import { Injectable, ConsoleLogger } from '@nestjs/common';
import * as winston from 'winston';
import { asyncStorage } from './async-storage';

@Injectable()
export class LoggerService extends ConsoleLogger {
  private readonly logger: winston.Logger;

  constructor() {
    super();
    this.logger = winston.createLogger({
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.json(),
          ),
        }),
        new winston.transports.File({
          filename: 'logs/app.log',
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.json(),
          ),
        }),
      ],
    });
  }

  private getContextAndMeta(context?: string, meta?: any) {
    const correlationId = asyncStorage.getStore()?.get('correlationId');
    const logMeta = {
      context: context || this.context,
      correlationId,
      ...meta,
    };
    return logMeta;
  }

  log(message: any, context?: string) {
    const meta = this.getContextAndMeta(context);
    this.logger.info(message, meta);
  }

  error(message: any, trace?: string, context?: string) {
    const meta = this.getContextAndMeta(context, { trace });
    this.logger.error(message, meta);
  }

  warn(message: string) {
    this.logger.warn(message);
  }

  debug(message: string) {
    this.logger.debug(message);
  }

  verbose(message: string) {
    this.logger.verbose(message);
  }
}
