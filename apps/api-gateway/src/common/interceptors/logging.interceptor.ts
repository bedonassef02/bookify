import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Request, Response } from 'express';
import { LoggerService } from '@app/shared';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger: LoggerService = new LoggerService();

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();
    const now = Date.now();

    const statusCode = response.statusCode;
    return next.handle().pipe(
      tap(() => {
        const elapsedTime = Date.now() - now;
        this.logger.debug(
          `[${request.method}] ${request.url} - [${statusCode}] ${elapsedTime}ms`,
        );
      }),
      catchError((error) => {
        const elapsedTime = Date.now() - now;
        this.logger.error(
          `[${request.method}] ${request.url} - [${statusCode}] ${elapsedTime}ms`,
        );
        this.logger.error(JSON.stringify(error));
        throw error;
      }),
    );
  }
}
