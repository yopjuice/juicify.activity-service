import { ActionType, ItemType } from "../../event/types/index.js";

export interface ILogInteraction{
  userId: string;
  itemType: ItemType;
  itemId: string;
  actionType: ActionType;
  weight: number;
}
