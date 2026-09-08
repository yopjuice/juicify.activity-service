import { Module, Global } from '@nestjs/common';
import { DatabaseProvider } from './db.provider.js';

@Global()
@Module({
  providers: [DatabaseProvider],
  exports: [DatabaseProvider],
})
export class DatabaseModule {}
