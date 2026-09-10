import { Module } from "@nestjs/common";
import { EventController } from "./event.controller.js";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { InteractionModule } from "../interaction/interaction.module.js";
import { RmqSetupService } from "../../infrastructure/rmq/rmq.setup.js";

@Module({
  controllers: [EventController],
  providers: [RmqSetupService],
  imports: [
    ClientsModule.register([
      {
        name: 'ACTIVITY_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://localhost:5672'],
          queue: 'cats_queue',
          queueOptions: {
            durable: false
          },
        },
      },
    ]),

    InteractionModule,
  ]
})
export class EventModule {}
