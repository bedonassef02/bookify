import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
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
