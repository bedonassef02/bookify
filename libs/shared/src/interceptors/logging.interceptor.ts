import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { RmqContext } from '@nestjs/microservices';
import { Redactor, LoggerService } from '@app/shared';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: LoggerService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const rpcContext = context.switchToRpc();
    const rmqContext = rpcContext.getContext<RmqContext>();
    const data = rpcContext.getData();
    const pattern = rmqContext.getPattern();
    const now = Date.now();

    return next.handle().pipe(
      tap((response) => {
        const elapsedTime = Date.now() - now;
        this.logger.log({
          message: 'Microservice call finished',
          pattern,
          elapsedTime,
          data: Redactor.sanitize(data),
          response: Redactor.sanitize(response),
        });
      }),
      catchError((error) => {
        const elapsedTime = Date.now() - now;
        this.logger.error({
          message: 'Microservice call failed',
          pattern,
          elapsedTime,
          data: Redactor.sanitize(data),
          error: error.message || error,
        });
        throw error;
      }),
    );
  }
}
