import { Module } from '@nestjs/common';
import { InteractionService } from './interaction.service.js';
import { InteractionRepo } from '../../infrastructure/interaction/interaction.repo.js';

@Module({
  providers: [InteractionService, InteractionRepo],
  exports: [InteractionService],
})
export class InteractionModule {}
