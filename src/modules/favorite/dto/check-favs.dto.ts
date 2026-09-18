import { IsArray, IsEnum, IsNotEmpty, IsString, IsUUID } from "class-validator";
import { ItemType } from "../../event/types/index.js";

export class CheckFavoriteDto {

  @IsUUID()
  userId: string;

  @IsEnum(ItemType)
  @IsNotEmpty()
  itemType: ItemType;

  @IsArray()
  @IsString({each: true})
  @IsNotEmpty({each: true})
  itemIds: string[];
}
