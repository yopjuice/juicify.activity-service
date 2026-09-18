import { TopItem } from '@juice11-micro/contracts';
import { ItemType } from '../../event/types/index.js';
import { TopItemsDto } from '../dto/top-item.dto.js';
import { TopItemsPayload } from '../interfaces/index.js';

interface DbTopItem {
  item_id: string;
  score: number;
}

export const StatsFixtures = {

  array: (count = 2): TopItem[] =>
    Array.from({ length: count }, (_, i) =>
    ({
      itemId: `5176cfd5-954f-46a1-bdb5-b4006a24ffc${i}`,
      score: 10 - 0.1 * i,
    })),

  rawArray: (count = 2): DbTopItem[] =>
    Array.from({ length: count }, (_, i) =>
    ({
      item_id: `5176cfd5-954f-46a1-bdb5-b4006a24ffc${i}`,
      score: 10 - 0.1 * i,
    })),
  // Generates an incoming RMQ DTO payload
  getTopItemsDto: (overrides?: Partial<TopItemsDto>): TopItemsDto => ({
    itemType: ItemType.Track,
    limit: 10,
    daysAgo: 7,
    ...overrides,
  }),


  getTopItemsPayload: (overrides?: Partial<TopItemsPayload>): TopItemsPayload => ({
    itemType: ItemType.Track,
    limit: 10,
    daysAgo: 7,
    ...overrides,
  }),

};
