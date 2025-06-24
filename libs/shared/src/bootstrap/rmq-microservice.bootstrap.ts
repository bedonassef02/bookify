import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { Type } from '@nestjs/common';
import { INestMicroservice } from '@nestjs/common/interfaces/nest-microservice.interface';

export const RmqMicroserviceBootstrap = (
  module: Type<any>,
  queue: string,
): Promise<INestMicroservice> =>
  NestFactory.createMicroservice<MicroserviceOptions>(module, {
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_URL ?? 'amqp://localhost:5672'],
      queue,
      queueOptions: {
        durable: false,
      },
    },
  });
