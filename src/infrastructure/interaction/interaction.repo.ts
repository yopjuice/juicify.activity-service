import { Injectable } from "@nestjs/common";
import { logInteraction } from "../../sql/generated/log.types.js";
import { DatabaseProvider } from "../db/db.provider.js";
import { LogPayload } from "../../modules/interaction/interfaces/index.js";
import { DbInteraction, InteractionMapper } from "./interaction.mapper.js";
import { Interaction } from "../../modules/interaction/interaction.entity.js";
import { findAllInteractions } from "../../sql/generated/findall.types.js";
import { findUserInteractions } from "../../sql/generated/find-by-user.types.js";
import { deleteInteraction } from "../../sql/generated/delete-by-id.types.js";

@Injectable()
export class InteractionRepo {

    constructor(private readonly db: DatabaseProvider) {}

  async log(data: LogPayload): Promise<Interaction> {

    const interaction = await this.db.runOne(logInteraction, {...data}) as DbInteraction;
    return InteractionMapper.toDomain(interaction);
  }

  async findAll(): Promise<Interaction[]> {
    const interactions = await this.db.run(findAllInteractions);
    return interactions.map(item => InteractionMapper.toDomain(item));
  }

  async findByUser(id: string): Promise<Interaction[]> {
    const interactions = await this.db.run(findUserInteractions, {userId: id});
    return interactions.map(item => InteractionMapper.toDomain(item));
  }

  async deleteById(id: string): Promise<boolean> {
    const result = await this.db.runOne(deleteInteraction, {id});
    return result != null;
  }
}
