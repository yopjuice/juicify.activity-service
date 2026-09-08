import { registerAs } from '@nestjs/config';
import { validateEnv } from '../../shared/utils/validate-env.js';
import type { GrpcConfig } from '../interfaces/grpc.interface.js';
import { GrpcValidator } from '../validators/grpc.validator.js';

// Loader for grpc env
export const grpcEnv = registerAs<GrpcConfig>('grpc', () => {
  const env = validateEnv(process.env, GrpcValidator);
  return {
    host: env.GRPC_HOST,
    port: env.GRPC_PORT,
  };
});
