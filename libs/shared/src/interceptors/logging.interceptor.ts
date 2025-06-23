import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { RmqContext } from '@nestjs/microservices';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToRpc();
    const data = ctx.getData();
    const pattern = ctx.getContext<RmqContext>().getPattern();

    this.logger.debug(`${pattern}: ${JSON.stringify(data)}`);

    return next.handle();
  }
}
