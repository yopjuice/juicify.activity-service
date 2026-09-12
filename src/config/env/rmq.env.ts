import { registerAs } from '@nestjs/config';
import { validateEnv } from '../../shared/utils/validate-env.js';
import type { RmqConfig } from '../interfaces/rmq.interface.js';
import { RmqValidator } from '../validators/rmq.validator.js';

// Loader for rmq env
export const rmqEnv = registerAs<RmqConfig>('rmq', () => {
  const env = validateEnv(process.env, RmqValidator);
  return {
    host: env.RMQ_HOST,
    port: env.RMQ_PORT,
  };
});
