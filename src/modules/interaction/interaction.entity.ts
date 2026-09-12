import { ActionType, ItemType } from "../event/types/index.js";

export interface InteractionProps {
  id: string;
  userId: string;
  itemType: ItemType;
  itemId: string;
  actionType: ActionType;
  weight: number;
  createdAt: Date;
}

export interface Interaction extends InteractionProps {}

export class Interaction {
  private props: InteractionProps;

  constructor(props: InteractionProps) {
    this.props = props;

    return new Proxy(this, {
      get(target, prop: string) {
        if (prop in target) return (target as any)[prop];
        return (target.props as any)[prop];
      }
    });
  }
}
