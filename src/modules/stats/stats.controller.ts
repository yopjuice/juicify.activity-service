import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { StatsService } from './stats.service.js';
import { TopItemsDto } from './dto/top-item.dto.js';
import { GetTopItemsResponse } from '@juice11-micro/contracts';

@Controller()
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @GrpcMethod('StatsService', 'GetTopItems')
  async getTopItems(data: TopItemsDto): Promise<GetTopItemsResponse> {
    const topItems = await this.statsService.getTopItems({...data});
    
    // returns an array of { itemId, score }
    return { items: topItems };
  }
}
