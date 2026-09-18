import { ItemType } from "../../event/types/index.js";

export interface AddPayload {
  userId: string;
  itemType: ItemType;
  itemId: string;
}

export interface DeletePayload {
  userId: string;
  itemType: ItemType;
  itemId: string;
}

export interface GetSubsetPayload {
  userId: string;
  itemType: ItemType;
  itemIds: string[];
}

export interface GetbyUserPayload {
  userId: string;
  itemType: ItemType;
}

