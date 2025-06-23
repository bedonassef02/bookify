import { RpcException } from '@nestjs/microservices';
import { HttpStatus } from '@nestjs/common';

export class RpcNotFoundException extends RpcException {
  constructor(message: string = 'Not Found') {
    super({
      statusCode: HttpStatus.NOT_FOUND,
      error: 'Not Found',
      message,
    });
  }
}
