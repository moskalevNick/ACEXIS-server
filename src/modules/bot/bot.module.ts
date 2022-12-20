import { RecognizerModule } from './../recognizer/recognizer.module';
import { Module } from '@nestjs/common';
import { TelegrafModule } from 'nestjs-telegraf';
import { BotUpdate } from './bot.update';

@Module({
  imports: [
    TelegrafModule.forRoot({
      token: process.env.BOT_TOKEN,
    }),
    RecognizerModule,
  ],
  providers: [BotUpdate, RecognizerModule],
})
export class BotModule {}
