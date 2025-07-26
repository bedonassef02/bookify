import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Request, Response } from 'express';
import { LoggerService } from '@app/shared/logger/logger.service';
import { MetricsService } from '@app/shared/metrics/metrics.service';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(
    private readonly logger: LoggerService,
    private readonly metricsService: MetricsService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();
    const now = Date.now();

    return next.handle().pipe(
      tap(() => {
        const elapsedTime = Date.now() - now;
        const { method, url } = request;
        const { statusCode } = response;

        const message = `[${method}] ${url} - ${statusCode} - ${elapsedTime}ms`;
        this.logger.log(message);

        this.metricsService.httpRequestDuration.observe(
          {
            method,
            route: url,
            code: statusCode,
          },
          elapsedTime / 1000,
        );
      }),
      catchError((error) => {
        const elapsedTime = Date.now() - now;
        const { method, url } = request;
        const { statusCode } = response;

        const message = `[${method}] ${url} - ${statusCode} - ${elapsedTime}ms`;
        this.logger.error(message);
        this.logger.error(JSON.stringify(error));

        this.metricsService.httpRequestDuration.observe(
          {
            method,
            route: url,
            code: statusCode,
          },
          elapsedTime / 1000,
        );

        throw error;
      }),
    );
  }
}
