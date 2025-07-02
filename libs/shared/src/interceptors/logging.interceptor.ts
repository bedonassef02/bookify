import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { RmqContext } from '@nestjs/microservices';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

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
        this.logger.verbose(JSON.stringify(data));
        this.logger.verbose(JSON.stringify(response));
      }),
      catchError((error) => {
        const elapsedTime = Date.now() - now;
        this.logger.error(`[${pattern}] - (${elapsedTime}ms)`);
        this.logger.error(JSON.stringify(data));
        this.logger.error(JSON.stringify(error));
        throw error;
      }),
    );
  }
}
