import { RpcException } from '@nestjs/microservices';
import { HttpStatus } from '@nestjs/common';

export class RpcConflictException extends RpcException {
  constructor(message: string = 'Conflict') {
    super({
      statusCode: HttpStatus.CONFLICT,
      error: 'Conflict',
      message,
    });
  }
}
