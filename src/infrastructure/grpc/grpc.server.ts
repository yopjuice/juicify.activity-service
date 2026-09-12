import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { grpcPackages, grpcProtoPaths, grpcLoader } from './gprc.options.js';
import { MyConfigService } from '../../config/config.service.js';
import { ReflectionService } from '@grpc/reflection';
import { Server } from '@grpc/grpc-js';
import { PackageDefinition } from '@grpc/proto-loader';
import { INestApplication } from '@nestjs/common';

export async function createGrpcServer(app: INestApplication) {
  const config = app.get<MyConfigService>(MyConfigService);

  const host = config.get('grpc.host');
  const port = config.get('grpc.port');

  const url = `${host}:${port}`;
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: grpcPackages,
      protoPath: grpcProtoPaths,
      url,
      loader: grpcLoader,
      onLoadPackageDefinition: (pkg: PackageDefinition, server: Server) => {
        new ReflectionService(pkg).addToServer(server);
      },
    },
  },
  );
  return app;
}
