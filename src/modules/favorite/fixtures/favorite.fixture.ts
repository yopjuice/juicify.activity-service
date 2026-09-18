import {
  FavoriteMapper,
  DbFavorite,
} from '../../../infrastructure/favorite/favorite.mapper.js';
import { FavoriteProps } from '../favorite.entity.js';
import { Favorite } from '../favorite.entity.js';
import { ActionType, ItemType } from '../../event/types/index.js';
import { AddPayload, DeletePayload, GetbyUserPayload } from '../interfaces/index.js';
import { ItemLikeEventDto } from '../dto/item-like.dto.js';
import { CheckFavoriteDto } from '../dto/check-favs.dto.js';
import { GetFavoriteDto } from '../dto/get-favs.dto.js';

// Default database object
const baseDbFavorite = {
  user_id: '5176cfd5-954f-46a1-bdb5-b4006a24ffcd',
  item_type: ItemType.Track,
  item_id: '5176cfd5-954f-46a1-bdb5-b4006a24ffcd',
  created_at: new Date('1970-01-01T00:00:00.000Z'),
} as const;

export const FavoriteFixtures = {
  // Get valid UUID
  uuid: (): string => baseDbFavorite.user_id,
  // Generates an Favorite entity
  entity: (overrides?: Partial<DbFavorite>): Favorite =>
    FavoriteMapper.toDomain({
      ...baseDbFavorite,
      ...overrides,
    }),

  // Generates an incoming RMQ DTO payload
  addDto: (overrides?: Partial<ItemLikeEventDto>): ItemLikeEventDto => ({
    userId: baseDbFavorite.user_id,
    itemType: baseDbFavorite.item_type,
    itemId: baseDbFavorite.item_id,
    ...overrides,
  }),


  addPayload: (overrides?: Partial<AddPayload>): AddPayload => ({
    userId: baseDbFavorite.user_id,
    itemType: baseDbFavorite.item_type,
    itemId: baseDbFavorite.item_id,
    ...overrides,
  }),


  checkFavoriteDto: (overrides?: Partial<CheckFavoriteDto>): CheckFavoriteDto => ({
    userId: baseDbFavorite.user_id,
    itemType: baseDbFavorite.item_type,
    itemIds: FavoriteFixtures.idsArray(),
    ...overrides,
  }),

  getUserFavoriteDto: (overrides?: Partial<GetFavoriteDto>): GetFavoriteDto => ({
    userId: baseDbFavorite.user_id,
    itemType: baseDbFavorite.item_type,
    ...overrides,
  }),

  getUserFavoritePayload: (overrides?: Partial<GetbyUserPayload>): GetbyUserPayload => ({
    userId: baseDbFavorite.user_id,
    itemType: baseDbFavorite.item_type,
    ...overrides,
  }),

  DeletePayload: (overrides?: Partial<DeletePayload>): DeletePayload => ({
    userId: baseDbFavorite.user_id,
    itemId: baseDbFavorite.item_id,
    itemType: baseDbFavorite.item_type,
    ...overrides,
  }),


  // Generates arrays of Favorite entities for bulk CRUD operations
  array: (count = 2): Favorite[] =>
    Array.from({ length: count }, (_, i) =>
      FavoriteMapper.toDomain({
        ...baseDbFavorite,
        item_id: `5176cfd5-954f-46a1-bdb5-b4006a24ffc${i}`,
      }),
    ),

  idsArray: (count = 2): string[] =>
    Array.from({ length: count }, (_, i) =>
      `5176cfd5-954f-46a1-bdb5-b4006a24ffc${i}`,
    ),
  // Generates a raw database object
  raw: (override?: Partial<DbFavorite>): DbFavorite => ({
    ...baseDbFavorite,
    ...override,
  }),

  // Generates an array of raw database objects
  rawArray: (count = 2): DbFavorite[] =>
    Array.from({ length: count }, (_, i) =>
      FavoriteFixtures.raw({
        ...baseDbFavorite,
        item_id: `5176cfd5-954f-46a1-bdb5-b4006a24ffc${i}`,
      }),
    ),

  // Generates Favorite entity props
  props: (overrides?: Partial<FavoriteProps>): FavoriteProps => ({
    userId: '5176cfd5-954f-46a1-bdb5-b4006a24ffcd',
    itemType: ItemType.Track,
    itemId: '5176cfd5-954f-46a1-bdb5-b4006a24ffcd',
    createdAt: new Date('1970-01-01T00:00:00.000Z'),
    ...overrides,
  }),
};
