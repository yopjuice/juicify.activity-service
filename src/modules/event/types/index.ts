import { ItemViewEventDto } from "../../interaction/dto/item-view.dto.js";
import { ItemLikeEventDto } from "../../favorite/dto/item-like.dto.js";
import { ACTIVITY_PATTERNS } from "../event.patterns.js";


export interface ActivityEventMap {
  [ACTIVITY_PATTERNS.CATALOG.ITEM.LIKED]: ItemLikeEventDto;
  [ACTIVITY_PATTERNS.CATALOG.ITEM.VIEWED]: ItemViewEventDto;
}

export type ActivityPattern = keyof ActivityEventMap;

export const ItemType = {
  Track: 'TRACK',
  Album: 'ALBUM',
  Artist: 'ARTIST',
} as const;

export type ItemType = typeof ItemType[keyof typeof ItemType];

export const ActionType = {
  View: 'VIEW',
  Like: 'LIKE',
  Unlike: 'UNLIKE',
  Dislike: 'DISLIKE',
} as const;

export type ActionType = typeof ActionType[keyof typeof ActionType];

