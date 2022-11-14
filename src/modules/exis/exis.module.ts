import { Global, Module } from '@nestjs/common';
import { ExisController } from './exis.controller';
import { ExisService } from './exis.service';

@Global()
@Module({
  controllers: [ExisController],
  providers: [ExisService],
  exports: [ExisService],
})
export class ExisModule {}
