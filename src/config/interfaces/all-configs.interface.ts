import { DatabaseConfig } from './database.interface.js';
import { GrpcConfig } from './grpc.interface.js';

// TODO: finish env
export interface AllConfigs {
  grpc: GrpcConfig;
  database: DatabaseConfig;
}
