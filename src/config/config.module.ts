import { Global, Module } from '@nestjs/common';
import { MyConfigService } from './config.service.js';
import { ConfigModule } from '@nestjs/config';
import { grpcEnv } from './env/grpc.env.js';
import { databaseEnv } from './env/database.env.js';
import { rmqEnv } from './env/rmq.env.js';

// Making this module global to call service easier
@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      // Loads namespaces (e.x. database.url)
      load: [grpcEnv, databaseEnv, rmqEnv],
    }),
  ],
  providers: [MyConfigService],
  exports: [MyConfigService],
})
export class MyConfigModule { }
