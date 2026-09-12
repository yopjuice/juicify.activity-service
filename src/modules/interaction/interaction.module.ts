import { Module } from '@nestjs/common';
import { InteractionService } from './interaction.service.js';
import { InteractionRepo } from '../../infrastructure/interaction/interaction.repo.js';
import { InteractionController } from './interaction.controller.js';
import { InteractionGrpc } from '../../infrastructure/interaction/interaction.client.js';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MyConfigService } from '../../config/config.service.js';
import { grpcPackages, grpcProtoPaths } from '../../infrastructure/grpc/gprc.options.js';
import { grpcClientInterceptor } from '../../infrastructure/grpc/grpc.client.interceptor.js';

@Module({
  controllers: [InteractionController],
  providers: [InteractionService, InteractionRepo, InteractionGrpc],
  exports: [InteractionService],
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'INTERACTION_INTERNAL_PROXY',
        inject: [MyConfigService],
        useFactory: (config: MyConfigService) => ({
          transport: Transport.GRPC,
          options: {
            url: `localhost:${config.get('grpc.port')}`,
            package: grpcPackages,
            protoPath: grpcProtoPaths,
            channelOptions: {
              interceptors: [grpcClientInterceptor],
            },
          },
        }),
      },
    ]),
 
  ]
})
export class InteractionModule {}
