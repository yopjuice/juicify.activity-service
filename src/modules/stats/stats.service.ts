import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { TopItem, TopItemsPayload } from './interfaces/index.js';
import { StatsRepo } from '../../infrastructure/stats/stats.repo.js';


@Injectable()
export class StatsService {
  constructor(
    private readonly repo: StatsRepo,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) { }

  async getTopItems(payload: TopItemsPayload): Promise<TopItem[]> {

    // default values
    const limit = payload.limit ?? 10;
    const daysAgo = payload.daysAgo ?? 7;
    const itemType = payload.itemType;

    const cacheKey = `top:${itemType}:limit:${limit}:days:${daysAgo}`;

    // checking cache
    const cachedData = await this.cacheManager.get<TopItem[]>(cacheKey);
    if (cachedData) {
      return cachedData;
    }
    const topItems = await this.repo.getTopItems(payload);
    // Saving value for 900 seconds
    await this.cacheManager.set(cacheKey, topItems, 900);

    return topItems;
  }
}
