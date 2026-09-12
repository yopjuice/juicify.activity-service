import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module.js';
import { createRmqServer } from './infrastructure/rmq/rmq.server.js';
import { MyLogger } from './infrastructure/logger/logger.service.js';
import { createGrpcServer } from './infrastructure/grpc/grpc.server.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  createGrpcServer(app)
  createRmqServer(app);


  app.useLogger(new MyLogger());

  const logger = new MyLogger();
  logger.log('Started all microservices')
  
  await app.init();
  await app.startAllMicroservices();
}
bootstrap();
