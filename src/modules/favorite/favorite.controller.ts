import { Controller, UseFilters, UseInterceptors, UsePipes } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { FavoriteService } from './favorite.service.js';
import { CheckFavoriteDto } from './dto/check-favs.dto.js';
import { GetFavoriteDto } from './dto/get-favs.dto.js';
import { CheckFavoritesResponse, FAVORITES_SERVICE_NAME, GetUserFavoritesResponse } from '@juice11-micro/contracts';
import { GrpcServerInterceptor } from '../../infrastructure/grpc/grpc.server.interceptor.js';
import { MyValidationPipe } from '../../shared/utils/validate-dto.js';
import { GrpcExceptionFilter } from '../../infrastructure/grpc/grpc.filter.js';


@UseFilters(GrpcExceptionFilter)
@UseInterceptors(GrpcServerInterceptor)
@UsePipes(MyValidationPipe)
@Controller()
export class FavoriteController {
  constructor(private readonly favoriteService: FavoriteService) {}

  @GrpcMethod(FAVORITES_SERVICE_NAME, 'CheckFavorites')
  async checkFavorite(data: CheckFavoriteDto): Promise<CheckFavoritesResponse> {
    const likedIds = await this.favoriteService.getLikedSubset(data);
    
    // Forming {"id": true/false} structure
    const results: Record<string, boolean> = {};
    data.itemIds.forEach(id => {
      results[id] = likedIds.includes(id);
    });

    return { results };
  }

  @GrpcMethod(FAVORITES_SERVICE_NAME, 'GetUserFavorites')
  async getUserFavorite(data: GetFavoriteDto): Promise<GetUserFavoritesResponse> {
    const itemIds = await this.favoriteService.getByUser(data);
    return { itemIds };
  }
}
