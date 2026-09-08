import { beforeAll } from 'vitest';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { MyLogger } from './src/infrastructure/logger/logger.service.js';
import { ValidationError } from './src/shared/errors/domain-errors.js';

beforeAll(() => {
  dotenv.config({ path: path.resolve(process.cwd(), '.env.test'), override: true });

  const logger = new MyLogger();

  const dbName = process.env.DATABASE_DB;
  const dbUrl = process.env.DATABASE_URL;

  if (!dbName || !dbName.includes('test') || !dbUrl || !dbUrl.includes('test')) {
    logger.error('Database name must contain "test"');
    throw new ValidationError('Database name must contain "test"');
  }
});
