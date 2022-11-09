import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ExisController } from './exis.controller';
import { ExisService } from './exis.service';
import { Exis, ExisSchema } from 'src/schemas/exis.schema';

@Global()
@Module({
  controllers: [ExisController],
  providers: [ExisService],
  exports: [ExisService],
  imports: [
    MongooseModule.forFeature([{ name: Exis.name, schema: ExisSchema }]),
  ],
})
export class ExisModule {}
