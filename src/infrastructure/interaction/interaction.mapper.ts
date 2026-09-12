import { ActionType, ItemType } from '../../modules/event/types/index.js';
import { Interaction as DomainInteraction } from '../../modules/interaction/interaction.entity.js';

// Database object interface
export interface DbInteraction {
  id: string;
  user_id: string;
  item_type: ItemType;
  item_id: string;
  action_type: ActionType;
  weight: number;
  created_at: Date;
}

export class InteractionMapper {
  // From Database to Domain
  public static toDomain(raw: DbInteraction): DomainInteraction {
    return new DomainInteraction({
      id: raw.id,
      userId: raw.user_id,
      itemType: raw.item_type,
      itemId: raw.item_id,
      actionType: raw.action_type,
      weight: raw.weight,
      createdAt: raw.created_at,
    });
  }

  // From Domain to Database
  public static toPersistence(domain: DomainInteraction): DbInteraction {
    return {
      id: domain.id,
      user_id: domain.userId,
      item_type: domain.itemType,
      item_id: domain.itemId,
      action_type: domain.actionType,
      weight: domain.weight,
      created_at: domain.createdAt,
    };
  }
}
