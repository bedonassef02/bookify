import {
  ArgumentsHost,
  Catch,
  ExceptionFilter as NestExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class ExceptionFilter implements NestExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();

    if (exception instanceof HttpException) {
      response.status(exception.getStatus()).json(exception.getResponse());
    } else {
      const statusCode =
        'statusCode' in exception
          ? (exception as { statusCode: number }).statusCode
          : HttpStatus.INTERNAL_SERVER_ERROR;

      response.status(statusCode).json(exception);
    }
  }
}
