import {  ItemType } from '../../modules/event/types/index.js';
import { Favorite as DomainFavorite } from '../../modules/favorite/favorite.entity.js';

// Database object interface
export interface DbFavorite {
  user_id: string;
  item_type: ItemType;
  item_id: string;
  created_at: Date;
}

export class FavoriteMapper {
  // From Database to Domain
  public static toDomain(raw: DbFavorite): DomainFavorite {
    return new DomainFavorite({
      userId: raw.user_id,
      itemType: raw.item_type,
      itemId: raw.item_id,
      createdAt: raw.created_at,
    });
  }

  // From Domain to Database
  public static toPersistence(domain: DomainFavorite): DbFavorite {
    return {
      user_id: domain.userId,
      item_type: domain.itemType,
      item_id: domain.itemId,
      created_at: domain.createdAt,
    };
  }
}
