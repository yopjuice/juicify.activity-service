import { IsUUID, IsNotEmpty, IsIn, IsEnum } from 'class-validator';
import { ItemType } from '../types/index.js';

export class ItemViewEventDto {
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @IsEnum(ItemType)
  @IsNotEmpty()
  itemType: ItemType;

  @IsUUID()
  @IsNotEmpty()
  itemId: string;
}
