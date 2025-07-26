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
  private readonly logger: LoggerService = new LoggerService();

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const rpcContext = context.switchToRpc();
    const rmqContext = rpcContext.getContext<RmqContext>();
    const data = rpcContext.getData();
    const pattern = rmqContext.getPattern();
    const now = Date.now();

    return next.handle().pipe(
      tap((response) => {
        const elapsedTime = Date.now() - now;
        this.logger.debug(`[${pattern}] - (${elapsedTime}ms)`);
        this.logger.verbose(`Data: ${JSON.stringify(Redactor.sanitize(data))}`);
        this.logger.verbose(
          `Response: ${JSON.stringify(Redactor.sanitize(response))}`,
        );
      }),
      catchError((error) => {
        const elapsedTime = Date.now() - now;
        this.logger.error(`[${pattern}] - (${elapsedTime}ms)`);
        this.logger.error(`Data: ${JSON.stringify(Redactor.sanitize(data))}`);
        this.logger.error(`Error: ${JSON.stringify(error.message || error)}`);
        throw error;
      }),
    );
  }
}
