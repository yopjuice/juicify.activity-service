import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { MyConfigService } from '../../config/config.service.js';
import { INestApplication } from '@nestjs/common';
import { RMQ_QUEUE_NAME, RMQ_QUEUE_OPTIONS } from './rmq.options.js';

export  function createRmqServer(app: INestApplication) {
  const config = app.get(MyConfigService);
  const host = config.get('rmq.host');
  const port = config.get('rmq.port');

  const url = `amqp://${host}:${port}`

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [url],
      queue: RMQ_QUEUE_NAME,
      noAck: false,
      queueOptions: RMQ_QUEUE_OPTIONS,
    },
  });
  return app;
}
