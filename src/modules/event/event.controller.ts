import { Controller, UseFilters, UsePipes } from '@nestjs/common';
import { Payload, Ctx, RmqContext, MessagePattern } from '@nestjs/microservices';
import { InteractionService } from '../interaction/interaction.service.js';
import { ItemViewEventDto } from './dto/item-view.dto.js';
import { ActionType } from './types/index.js';
import { Channel, Message } from 'amqplib';
import { ACTIVITY_PATTERNS } from './event.patterns.js';
import { RmqExceptionFilter } from '../../infrastructure/rmq/rmq.filter.js';
import { MyValidationPipe } from '../../shared/utils/validate-dto.js';
import { MyLogger } from '../../infrastructure/logger/logger.service.js';

@UsePipes(MyValidationPipe)
@UseFilters(RmqExceptionFilter)
@Controller()
export class EventController {

  private readonly logger = new MyLogger();

  constructor(
    private readonly interactionsService: InteractionService,
  ) { }

  @MessagePattern(ACTIVITY_PATTERNS.CATALOG.ITEM.VIEWED)
  async handleItemViewed(
    @Payload() data: ItemViewEventDto,
    @Ctx() context: RmqContext
  ) {
    const channel: Channel = context.getChannelRef();
    const originalMsg = context.getMessage() as Message;

    await this.interactionsService.log({
      userId: data.userId,
      itemType: data.itemType,
      itemId: data.itemId,
      actionType: ActionType.View,
      weight: 1,
    });

    channel.ack(originalMsg);
    this.logger.log(`Message ${ACTIVITY_PATTERNS.CATALOG.ITEM.VIEWED} (${data.itemType}) handled correctly`);
  }

  // @MessagePattern('catalog.track.liked')
  // async handleTrackLiked(
  //   @Payload() data: TrackLikeEventDto,
  //   @Ctx() context: RmqContext,
  // ) {
  //   const channel: Channel = context.getChannelRef();
  //   const originalMsg = context.getMessage() as Message;
  //
  //   try {
  //     await this.interactionsService.log({
  //       userId: data.userId,
  //       itemType: ItemType.Track,
  //       itemId: data.trackId,
  //       actionType: ActionType.Like,
  //       weight: 5,
  //     });
  //
  //     await this.favoritesService.addToFavorites(data.userId, 'track', data.trackId);
  //
  //
  //     channel.ack(originalMsg);
  //   } catch (error) {
  //
  //     channel.nack(originalMsg, false, true); 
  //   }
  // }

}
