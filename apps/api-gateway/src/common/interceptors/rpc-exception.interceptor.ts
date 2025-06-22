import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpStatus } from '@nestjs/common';

@Injectable()
export class RpcExceptionInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((error) => {
        const response = context.switchToHttp().getResponse();

        const statusCode = error.status || HttpStatus.INTERNAL_SERVER_ERROR;
        response.status(statusCode).json({
          statusCode,
          message: error.message || 'Internal server error',
        });
        return throwError(() => error);
      }),
    );
  }
}
