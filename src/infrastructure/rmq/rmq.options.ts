import { AmqplibQueueOptions } from "@nestjs/microservices/external/rmq-url.interface.js";

export const RMQ_QUEUE_OPTIONS: AmqplibQueueOptions = {
  durable: true,
  arguments: {
    'x-dead-letter-exchange': 'activity_dlx',
    'x-dead-letter-routing-key': 'activity_queue.dead',
  }
}
export const RMQ_QUEUE_NAME = 'activity_queue';
