import { Injectable } from "@nestjs/common";
import { logInteraction } from "../../sql/generated/log.types.js";
import { DatabaseProvider } from "../db/db.provider.js";
import { ILogInteraction } from "../../modules/interaction/interfaces/index.js";

@Injectable()
export class InteractionRepo {

    constructor(private readonly db: DatabaseProvider) {}

  async log(data: ILogInteraction): Promise<void> {

    await this.db.runOne(logInteraction, {...data});
  }
}
