import { Module } from '@nestjs/common';
import { FavoriteService } from './favorite.service.js';
import { FavoriteRepo } from '../../infrastructure/favorite/favorite.repo.js';
import { FavoriteController } from './favorite.controller.js';
import { FavoriteGrpc } from '../../infrastructure/favorite/favorite.client.js';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MyConfigService } from '../../config/config.service.js';
import { grpcPackages, grpcProtoPaths } from '../../infrastructure/grpc/gprc.options.js';
import { grpcClientInterceptor } from '../../infrastructure/grpc/grpc.client.interceptor.js';

@Module({
  controllers: [FavoriteController],
  providers: [FavoriteService, FavoriteRepo, FavoriteGrpc],
  exports: [FavoriteService],
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'FAVORITE_INTERNAL_PROXY',
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
export class FavoriteModule {}
