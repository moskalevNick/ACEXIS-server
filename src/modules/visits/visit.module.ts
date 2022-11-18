import { Global, Module } from '@nestjs/common';
import { VisitController } from './visit.controller';
import { VisitService } from './visit.service';

@Global()
@Module({
  controllers: [VisitController],
  providers: [VisitService],
  exports: [VisitService],
})
export class VisitModule {}
