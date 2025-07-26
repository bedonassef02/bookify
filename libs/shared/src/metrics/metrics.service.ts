import { Injectable } from '@nestjs/common';
import * as client from 'prom-client';

@Injectable()
export class MetricsService {
  public readonly usersCreated: client.Counter<'provider'>;
  public readonly httpRequestDuration: client.Histogram<
    'method' | 'route' | 'code'
  >;

  constructor() {
    this.usersCreated = new client.Counter({
      name: 'users_created_total',
      help: 'Total number of users created.',
      labelNames: ['provider'], // e.g., 'local', 'google'
    });

    this.httpRequestDuration = new client.Histogram({
      name: 'http_request_duration_seconds',
      help: 'Duration of HTTP requests in seconds',
      labelNames: ['method', 'route', 'code'],
      buckets: [0.1, 0.5, 1, 1.5, 2, 5],
    });
  }
}
