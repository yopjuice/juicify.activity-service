import { Injectable } from '@nestjs/common';
import { LogPayload } from './interfaces/index.js';
import { InteractionRepo } from '../../infrastructure/interaction/interaction.repo.js';
import { Interaction } from './interaction.entity.js';
import { EntityNotFoundError } from '../../shared/errors/domain-errors.js';

@Injectable()
export class InteractionService {
  constructor(private readonly repo: InteractionRepo) {}

  async log(data: LogPayload): Promise<Interaction> {
    return this.repo.log(data)
  }

  async findAll(): Promise<Interaction[]> {
    return this.repo.findAll();
  }

  async findByUser(id: string, limit: number): Promise<Interaction[]> {
    return this.repo.findByUser(id, limit);
  }

  async deleteById(id: string): Promise<void> {
    const isDeleted = await this.repo.deleteById(id);
    if (!isDeleted) throw new EntityNotFoundError('interaction');
  }
}
