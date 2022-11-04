import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ExisController } from './exis.controller';
import { ExisService } from './exis.service';
import { Exis, ExisSchema } from 'src/schemas/exis.schema';

@Module({
  controllers: [ExisController],
  providers: [ExisService],
  imports: [
    MongooseModule.forFeature([{ name: Exis.name, schema: ExisSchema }]),
  ],
})
export class ExisModule {}
