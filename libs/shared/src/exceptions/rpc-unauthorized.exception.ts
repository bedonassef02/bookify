import { RpcException } from '@nestjs/microservices';
import { HttpStatus } from '@nestjs/common';

export class RpcUnauthorizedException extends RpcException {
  constructor(message: string = 'Unauthorized') {
    super({
      statusCode: HttpStatus.UNAUTHORIZED,
      error: 'Unauthorized',
      message,
    });
  }
}
