import {
  Catch,
  ArgumentsHost,
  ExceptionFilter as NestExceptionFilter,
} from '@nestjs/common';
import { throwError } from 'rxjs';
import { RpcException } from '@nestjs/microservices';

@Catch()
export class ExceptionFilter implements NestExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    if (!(exception instanceof RpcException)) {
      return throwError(() => exception);
    }
  }
}
