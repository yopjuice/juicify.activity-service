import { Module } from '@nestjs/common';
import { InteractionService } from './interaction.service.js';
import { InteractionRepo } from '../../infrastructure/interaction/interaction.repo.js';
import { InteractionController } from './interaction.controller.js';

@Module({
  controllers: [InteractionController],
  providers: [InteractionService, InteractionRepo],
  exports: [InteractionService],
})
export class InteractionModule {}
