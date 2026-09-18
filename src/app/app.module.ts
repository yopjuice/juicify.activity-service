import { Module } from '@nestjs/common';
import { MyConfigModule } from '../config/config.module.js';
import { DatabaseModule } from '../infrastructure/db/db.module.js';
import { EventModule } from '../modules/event/event.module.js';
import { InteractionModule } from '../modules/interaction/interaction.module.js';
import { FavoriteModule } from '../modules/favorite/favorite.module.js';
import { StatsModule } from '../modules/stats/stats.module.js';


@Module({
  imports: [
    MyConfigModule,
    DatabaseModule,
    EventModule,
    InteractionModule,
    FavoriteModule,
    StatsModule,
  ]
})
export class AppModule {}
