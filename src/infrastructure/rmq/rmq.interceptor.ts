import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { RmqContext } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Channel, Message } from 'amqplib';

@Injectable()
export class RmqAckInterceptor implements NestInterceptor {
  private readonly logger = new Logger(RmqAckInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // check if the interceptor is applied to the rpc method
    if (context.getType() !== 'rpc') {
      return next.handle();
    }

    const rmqContext = context.switchToRpc().getContext<RmqContext>();
    const channel: Channel = rmqContext.getChannelRef();
    const originalMsg = rmqContext.getMessage() as Message;

    return next.handle().pipe(
      // handler finished successfully
      tap(() => {
        channel.ack(originalMsg);
        this.logger.log(`Message ${originalMsg.properties.correlationId} acknowledged`);
      }),
      catchError((error) => {
        channel.nack(originalMsg, false, false);
        this.logger.error(`Message ${originalMsg.properties.correlationId} rejected`);
        throw error;
      }),
    );
  }
}
