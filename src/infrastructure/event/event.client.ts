import { Injectable, Inject, Logger } from '@nestjs/common';
import type { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { ActivityPattern } from '../../modules/event/event.patterns.js';
import { ActivityEventMap } from '../../modules/event/types/index.js';

@Injectable()
export class EventRmqClient {
  private readonly logger = new Logger(EventRmqClient.name);

  constructor(
    @Inject('ACTIVITY_RMQ_PROXY') private readonly rmqClient: ClientProxy,
  ) { }

  public async emit<K extends ActivityPattern>(
    pattern: K,
    data: ActivityEventMap[K],
  ): Promise<void> {
    this.logger.log(`[RMQ Outgoing Event] Emit: ${pattern}`, { data });

    try {
      const result = this.rmqClient.emit(pattern, data);
      await lastValueFrom(result);
    } catch (error: any) {
      this.logger.error(`[RMQ Outgoing Error] ${pattern} failed to emit: ${error.message}`);
      throw error;
    }
  }
}
