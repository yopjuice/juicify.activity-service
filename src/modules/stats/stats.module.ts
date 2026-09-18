import { Module } from '@nestjs/common';
import { StatsService } from './stats.service.js';
import { StatsRepo } from '../../infrastructure/stats/stats.repo.js';
import { StatsController } from './stats.controller.js';
import { StatsGrpc } from '../../infrastructure/stats/stats.client.js';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MyConfigService } from '../../config/config.service.js';
import { grpcPackages, grpcProtoPaths } from '../../infrastructure/grpc/gprc.options.js';
import { grpcClientInterceptor } from '../../infrastructure/grpc/grpc.client.interceptor.js';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  controllers: [StatsController],
  providers: [StatsService, StatsRepo, StatsGrpc],
  exports: [StatsService],
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'STATS_INTERNAL_PROXY',
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

    CacheModule.register(),
  ]
})
export class StatsModule { }
