import { Controller, Logger, UseFilters, UseInterceptors, UsePipes } from '@nestjs/common';
import { Payload, MessagePattern } from '@nestjs/microservices';
import { InteractionService } from '../interaction/interaction.service.js';
import { ItemViewEventDto } from '../interaction/dto/item-view.dto.js';
import { ActionType } from './types/index.js';
import { ACTIVITY_PATTERNS } from './event.patterns.js';
import { RmqExceptionFilter } from '../../infrastructure/rmq/rmq.filter.js';
import { MyValidationPipe } from '../../shared/utils/validate-dto.js';
import { RmqAckInterceptor } from '../../infrastructure/rmq/rmq.interceptor.js';
import { ItemLikeEventDto } from '../favorite/dto/item-like.dto.js';
import { FavoriteService } from '../favorite/favorite.service.js';

@UsePipes(MyValidationPipe)
@UseFilters(RmqExceptionFilter)
@UseInterceptors(RmqAckInterceptor)
@Controller()
export class EventController {

  private readonly logger = new Logger(EventController.name);

  constructor(
    private readonly intersService: InteractionService,
    private readonly favsService: FavoriteService,
  ) { }

  @MessagePattern(ACTIVITY_PATTERNS.CATALOG.ITEM.VIEWED)
  async handleItemViewed(
    @Payload() data: ItemViewEventDto,
  ) {
    await this.intersService.log({
      userId: data.userId,
      itemType: data.itemType,
      itemId: data.itemId,
      actionType: ActionType.View,
      weight: 1,
    });

    this.logger.log(`Message ${ACTIVITY_PATTERNS.CATALOG.ITEM.VIEWED} (${data.itemType}) handled correctly`);
  }

  @MessagePattern(ACTIVITY_PATTERNS.CATALOG.ITEM.LIKED)
  async handleTrackLiked(
    @Payload() data: ItemLikeEventDto,
  ) {
    await this.intersService.log({
      ...data,
      actionType: ActionType.Like,
      weight: 5,
    });

    await this.favsService.add(data);

    this.logger.log(`Message ${ACTIVITY_PATTERNS.CATALOG.ITEM.LIKED} (${data.itemType}) handled correctly`);
  }

}
