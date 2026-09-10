import { Catch, ArgumentsHost, RpcExceptionFilter  } from '@nestjs/common';
import {  RmqContext } from '@nestjs/microservices';
import { Channel, Message } from 'amqplib';
import { MyLogger } from '../logger/logger.service.js';
import { of } from 'rxjs';


@Catch()
export class RmqExceptionFilter implements RpcExceptionFilter {

  private readonly logger = new MyLogger();

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToRpc();
    const rmqContext = ctx.getContext<RmqContext>();
    const channel = rmqContext.getChannelRef() as Channel;
    const originalMsg = rmqContext.getMessage() as Message;

    channel.nack(originalMsg, false, false);

    this.logger.error('[Rmq Error] ' + exception);
    
    return of(null);
  }
}
