import {
  InteractionMapper,
  DbInteraction,
} from '../../../infrastructure/interaction/interaction.mapper.js';
import { InteractionProps } from '../interaction.entity.js';
import { Interaction } from '../interaction.entity.js';
import { ItemViewEventDto } from '../dto/item-view.dto.js';
import { ActionType, ItemType } from '../../event/types/index.js';
import { LogPayload } from '../interfaces/index.js';
import { GetUserActivityDto } from '../dto/get-activity.js';

// Default database object
const baseDbInteraction = {
  id: '5176cfd5-954f-46a1-bdb5-b4006a24ffcd',
  user_id: '5176cfd5-954f-46a1-bdb5-b4006a24ffcd',
  item_type: ItemType.Track,
  item_id: '5176cfd5-954f-46a1-bdb5-b4006a24ffcd',
  action_type: ActionType.Like,
  weight: 5,
  created_at: new Date('1970-01-01T00:00:00.000Z'),
} as const;

export const InteractionFixtures = {
  // Get valid UUID
  uuid: (): string => baseDbInteraction.id,
  // Generates an Interaction entity
  entity: (overrides?: Partial<DbInteraction>): Interaction =>
    InteractionMapper.toDomain({
      ...baseDbInteraction,
      ...overrides,
    }),

  password: () => 'my-password123',

  // Generates an incoming RMQ DTO payload
  logDto: (overrides?: Partial<ItemViewEventDto>): ItemViewEventDto => ({
    userId: baseDbInteraction.user_id,
    itemType: baseDbInteraction.item_type,
    itemId: baseDbInteraction.item_id,
    ...overrides,
  }),

  getUserActivityDto: (overrides?: Partial<GetUserActivityDto>): GetUserActivityDto => ({
    userId: baseDbInteraction.user_id,
    limit: 5,
    ...overrides,
  }),

  logPayload: (overrides?: Partial<LogPayload>): LogPayload => ({
    userId: baseDbInteraction.user_id,
    itemType: baseDbInteraction.item_type,
    itemId: baseDbInteraction.item_id,
    actionType: ActionType.View,
    weight: 1,
    ...overrides,
  }),

  // Generates arrays of Interaction entities for bulk CRUD operations
  array: (count = 2): Interaction[] =>
    Array.from({ length: count }, (_, i) =>
      InteractionMapper.toDomain({
        ...baseDbInteraction,
        id: `5176cfd5-954f-46a1-bdb5-b4006a24ffc${i}`,
      }),
    ),

  // Generates a raw database object
  raw: (override?: Partial<DbInteraction>): DbInteraction => ({
    ...baseDbInteraction,
    ...override,
  }),

  // Generates an array of raw database objects
  rawArray: (count = 2): DbInteraction[] =>
    Array.from({ length: count }, (_, i) =>
      InteractionFixtures.raw({
        ...baseDbInteraction,
        id: `5176cfd5-954f-46a1-bdb5-b4006a24ffc${i}`,
      }),
    ),

  // Generates Interaction entity props
  props: (overrides?: Partial<InteractionProps>): InteractionProps => ({
    id: '5176cfd5-954f-46a1-bdb5-b4006a24ffcd',
    userId: '5176cfd5-954f-46a1-bdb5-b4006a24ffcd',
    itemType: ItemType.Track,
    itemId: '5176cfd5-954f-46a1-bdb5-b4006a24ffcd',
    actionType: ActionType.Like,
    weight: 5,
    createdAt: new Date('1970-01-01T00:00:00.000Z'),
    ...overrides,
  }),
};
