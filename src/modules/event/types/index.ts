import { ItemViewEventDto } from "../../interaction/dto/item-view.dto.js";
import { TrackLikeEventDto } from "../dto/track-like.dto.js";
import { ACTIVITY_PATTERNS } from "../event.patterns.js";


export interface ActivityEventMap {
  [ACTIVITY_PATTERNS.CATALOG.TRACK.LIKED]: TrackLikeEventDto;
  [ACTIVITY_PATTERNS.CATALOG.ITEM.VIEWED]: ItemViewEventDto;
}

export type ActivityPattern = keyof ActivityEventMap;
