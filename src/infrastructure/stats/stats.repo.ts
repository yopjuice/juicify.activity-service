import { Injectable } from "@nestjs/common";
import { DatabaseProvider } from "../db/db.provider.js";
import { TopItem } from "@juice11-micro/contracts";
import { TopItemsPayload } from "../../modules/stats/interfaces/index.js";
import { getTopItems } from "../../sql/generated/calcTop.types.js";


@Injectable()
export class StatsRepo {

  constructor(private readonly db: DatabaseProvider) { }

  async getTopItems(payload: TopItemsPayload): Promise<TopItem[]> {
    const result = await this.db.run(getTopItems, { ...payload, daysAgo: payload.daysAgo.toString() });

    const topItems: TopItem[] = result.map(row => ({
      itemId: row.item_id,
      score: row.score ?? 0,
    }));
    return topItems;
  }
}
