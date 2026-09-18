import { Injectable } from "@nestjs/common";
import { DatabaseProvider } from "../db/db.provider.js";
import { addFavorite } from "../../sql/generated/add.types.js";
import { deleteFavorite } from "../../sql/generated/delete.types.js";
import { getFavoriteLikedSubset } from "../../sql/generated/getLikedSubset.types.js";
import { getFavoriteByUser } from "../../sql/generated/getByUser.types.js";
import { AddPayload, DeletePayload, GetbyUserPayload, GetSubsetPayload } from "../../modules/favorite/interfaces/index.js";
import { DbFavorite, FavoriteMapper } from "./favorite.mapper.js";
import { Favorite } from "../../modules/favorite/favorite.entity.js";


@Injectable()
export class FavoriteRepo {

  constructor(private readonly db: DatabaseProvider) { }

  async add(data: AddPayload): Promise<Favorite> {
    const fav = await this.db.runOne(addFavorite, { ...data }) as DbFavorite;
    return FavoriteMapper.toDomain(fav);

  }

  async delete(data: DeletePayload): Promise<boolean> {
    const result = await this.db.runOne(deleteFavorite, { ...data });
    return result != null;
  }

  async getLikedSubset(data: GetSubsetPayload): Promise<string[]> {
    const itemIds = data.itemIds;
    if (!itemIds || itemIds.length === 0) return [];
    const result = await this.db.run(getFavoriteLikedSubset, { ...data });
    return result.map(row => row.item_id);
  }

  async getByUser(data: GetbyUserPayload): Promise<string[]> {
    const result = await this.db.run(getFavoriteByUser, { ...data });
    return result.map(row => row.item_id);
  }
}
