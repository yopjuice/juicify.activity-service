import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { FavoriteService } from './favorite.service.js';
import { CheckFavoriteDto } from './dto/check-favs.dto.js';
import { GetFavoriteDto } from './dto/get-favs.dto.js';
import { CheckFavoritesResponse, FAVORITES_SERVICE_NAME, GetUserFavoritesResponse } from '@juice11-micro/contracts';


@Controller()
export class FavoriteController {
  constructor(private readonly favoriteService: FavoriteService) {}

  @GrpcMethod(FAVORITES_SERVICE_NAME, 'CheckFavorite')
  async checkFavorite(data: CheckFavoriteDto): Promise<CheckFavoritesResponse> {
    const likedIds = await this.favoriteService.getLikedSubset(data);
    
    // Forming {"id": true/false} structure
    const results: Record<string, boolean> = {};
    data.itemIds.forEach(id => {
      results[id] = likedIds.includes(id);
    });

    return { results };
  }

  @GrpcMethod(FAVORITES_SERVICE_NAME, 'GetUserFavorite')
  async getUserFavorite(data: GetFavoriteDto): Promise<GetUserFavoritesResponse> {
    const itemIds = await this.favoriteService.getByUser(data);
    return { itemIds };
  }
}
