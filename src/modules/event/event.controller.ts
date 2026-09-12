import { Controller, Logger, UseFilters, UseInterceptors, UsePipes } from '@nestjs/common';
import { Payload, MessagePattern } from '@nestjs/microservices';
import { InteractionService } from '../interaction/interaction.service.js';
import { ItemViewEventDto } from '../interaction/dto/item-view.dto.js';
import { ActionType } from './types/index.js';
import { ACTIVITY_PATTERNS } from './event.patterns.js';
import { RmqExceptionFilter } from '../../infrastructure/rmq/rmq.filter.js';
import { MyValidationPipe } from '../../shared/utils/validate-dto.js';
import { RmqAckInterceptor } from '../../infrastructure/rmq/rmq.interceptor.js';

@UsePipes(MyValidationPipe)
@UseFilters(RmqExceptionFilter)
@UseInterceptors(RmqAckInterceptor)
@Controller()
export class EventController {

  private readonly logger = new Logger(EventController.name);

  constructor(
    private readonly interactionsService: InteractionService,
  ) { }

  @MessagePattern(ACTIVITY_PATTERNS.CATALOG.ITEM.VIEWED)
  async handleItemViewed(
    @Payload() data: ItemViewEventDto,
  ) {
    await this.interactionsService.log({
      userId: data.userId,
      itemType: data.itemType,
      itemId: data.itemId,
      actionType: ActionType.View,
      weight: 1,
    });

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
