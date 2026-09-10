import { Injectable, OnModuleInit } from '@nestjs/common';
import * as amqp from 'amqplib';
import { MyLogger } from '../logger/logger.service.js';

@Injectable()
export class RmqSetupService implements OnModuleInit {

  private readonly logger = new MyLogger();

  async onModuleInit(): Promise<void> {
    this.logger.log('Setting rmq...');
    const rmqUrl = 'amqp://localhost:5672';

    try {
      const connection = await amqp.connect(rmqUrl);
      const channel = await connection.createChannel();

      const dlxExchange = 'activity.dlx';
      await channel.assertExchange(dlxExchange, 'topic', { durable: true });

      const dlqQueue = 'activity_queue.dead';
      await channel.assertQueue(dlqQueue, { durable: true });

      await channel.bindQueue(dlqQueue, dlxExchange, 'activity_queue.dead');

      await channel.close();
      await connection.close();

      this.logger.log('RabbitMQ Exchanges, DLQ and Bindings successfully configured!');
    } catch (error) {
      this.logger.error('Failed to setup RabbitMQ topology:' + error);
    }
  }
}
