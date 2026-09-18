import { IsEnum, IsNumber } from "class-validator";
import { ItemType } from "../../event/types/index.js";

export class TopItemsDto {
  @IsEnum(ItemType)
  itemType: ItemType;

  @IsNumber()
  limit: number;

  @IsNumber()
  daysAgo: number;
}
