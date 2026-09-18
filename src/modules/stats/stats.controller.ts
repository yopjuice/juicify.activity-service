import { Controller, UseFilters, UseInterceptors, UsePipes } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { StatsService } from './stats.service.js';
import { TopItemsDto } from './dto/top-item.dto.js';
import { GetTopItemsResponse } from '@juice11-micro/contracts';
import { GrpcServerInterceptor } from '../../infrastructure/grpc/grpc.server.interceptor.js';
import { MyValidationPipe } from '../../shared/utils/validate-dto.js';
import { GrpcExceptionFilter } from '../../infrastructure/grpc/grpc.filter.js';

@UseFilters(GrpcExceptionFilter)
@UseInterceptors(GrpcServerInterceptor)
@UsePipes(MyValidationPipe)
@Controller()
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
