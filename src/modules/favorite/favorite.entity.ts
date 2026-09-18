import {  ItemType } from "../event/types/index.js";

export interface FavoriteProps {
  userId: string;
  itemType: ItemType;
  itemId: string;
  createdAt: Date;
}

export interface Favorite extends FavoriteProps {}

export class Favorite {
  private props: FavoriteProps;

  constructor(props: FavoriteProps) {
    this.props = props;

    return new Proxy(this, {
      get(target, prop: string) {
        if (prop in target) return (target as any)[prop];
        return (target.props as any)[prop];
      }
    });
  }
}
