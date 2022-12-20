import { RecognizerModule } from './../recognizer/recognizer.module';
import { Module } from '@nestjs/common';
import { TelegrafModule } from 'nestjs-telegraf';
import { BotUpdate } from './bot.update';

@Module({
  imports: [
    TelegrafModule.forRootAsync({
      useFactory: () => ({
        token: process.env.BOT_TOKEN,
      }),
    }),
    RecognizerModule,
  ],
  providers: [BotUpdate],
})
export class BotModule {}
