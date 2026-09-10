import { Injectable } from '@nestjs/common';
import { ILogInteraction } from './interfaces/index.js';
import { InteractionRepo } from '../../infrastructure/interaction/interaction.repo.js';

@Injectable()
export class InteractionService {
  constructor(private readonly repo: InteractionRepo) {}

  async log(data: ILogInteraction): Promise<void> {
    return this.repo.log(data)
  }
}
