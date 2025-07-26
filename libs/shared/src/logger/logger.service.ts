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
    super.log(message);
    const meta = this.getContextAndMeta(context);
    this.logger.info(message, meta);
  }

  error(message: any, trace?: string, context?: string) {
    super.log(message);
    const meta = this.getContextAndMeta(context, { trace });
    this.logger.error(message, meta);
  }

  warn(message: string) {
    super.log(message);
    this.logger.warn(message);
  }

  debug(message: string) {
    super.log(message);
    this.logger.debug(message);
  }

  verbose(message: string) {
    super.log(message);
    this.logger.verbose(message);
  }
}
