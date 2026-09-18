import { Module } from "@nestjs/common";
import { EventController } from "./event.controller.js";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { InteractionModule } from "../interaction/interaction.module.js";
import { RmqSetupService } from "../../infrastructure/rmq/rmq.setup.js";
import { MyConfigService } from "../../config/config.service.js";
import { RMQ_QUEUE_NAME, RMQ_QUEUE_OPTIONS } from "../../infrastructure/rmq/rmq.options.js";
import { EventRmqClient } from "../../infrastructure/event/event.client.js";
import { FavoriteModule } from "../favorite/favorite.module.js";

@Module({
  controllers: [EventController],
  providers: [RmqSetupService, EventRmqClient],
  imports: [

    ClientsModule.registerAsync([
      {
        name: 'ACTIVITY_RMQ_PROXY',
        useFactory: (config: MyConfigService) => {
          const host = config.get('rmq.host');
          const port = config.get('rmq.port');

          const url = `amqp://${host}:${port}`

          return {
            name: 'ACTIVITY_RMQ_PROXY',
            transport: Transport.RMQ,
            options: {
              urls: [url],
              queue: RMQ_QUEUE_NAME,
              noAck: true,
              queueOptions: RMQ_QUEUE_OPTIONS,
            },
          };
        },
        inject: [MyConfigService],
      },
    ]),


    InteractionModule,
    FavoriteModule,
  ]
})
export class EventModule { }




