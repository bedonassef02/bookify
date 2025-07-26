import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { asyncStorage } from '../logger/async-storage';
import { LoggerService } from '../logger/logger.service';
import { Request } from 'express';

export const CORRELATION_ID_HEADER = 'X-Correlation-ID';

@Injectable()
export class CorrelationIdInterceptor implements NestInterceptor {
  constructor(private readonly logger: LoggerService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request: Request = context.switchToHttp().getRequest();
    let correlationId = request.headers[CORRELATION_ID_HEADER] || randomUUID();
    if (Array.isArray(correlationId)) {
      correlationId = correlationId[0];
    }

    return asyncStorage.run(new Map([['correlationId', correlationId]]), () => {
      this.logger.log('Request started');
      return next.handle().pipe(
        tap(() => {
          this.logger.log('Request finished');
        }),
      );
    });
  }
}
