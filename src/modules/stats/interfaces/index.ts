import { ItemType } from "../../event/types/index.js";

export interface TopItemsPayload {
  itemType: ItemType;
  limit: number;
  daysAgo: number;
}

export interface TopItem {
  itemId: string;
  score: number;
}
