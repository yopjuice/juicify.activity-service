import { Module } from '@nestjs/common';
import { MyConfigModule } from '../config/config.module.js';
import { DatabaseModule } from '../infrastructure/db/db.module.js';
import { EventModule } from '../modules/event/event.module.js';
import { InteractionModule } from '../modules/interaction/interaction.module.js';


@Module({
  imports: [
    MyConfigModule,
    DatabaseModule,
    EventModule,
    InteractionModule,
  ]
})
export class AppModule {}
