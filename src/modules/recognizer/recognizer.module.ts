import { Global, Module } from '@nestjs/common';
// import { BotUpdate } from '../bot/bot.update';
import { RecognizerController } from './recognizer.controller';
import { RecognizerService } from './recognizer.service';

@Global()
@Module({
  controllers: [RecognizerController],
  providers: [RecognizerService],
  exports: [RecognizerService],
})
export class RecognizerModule {}
