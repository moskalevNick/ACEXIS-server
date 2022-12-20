import { Module } from '@nestjs/common';
import { TelegrafModule } from 'nestjs-telegraf';
import LocalSession from 'telegraf-session-local';
import { BotService } from './bot.service';
import { BotUpdate } from './bot.update';
require('dotenv').config();

const sessions = new LocalSession({
  database: 'session_db.json',
});

@Module({
  imports: [
    TelegrafModule.forRoot({
      token: process.env.TELEGRAM_TOKEN,
      middlewares: [sessions.middleware()],
    }),
  ],
  providers: [BotUpdate, BotService],
})
export class BotModule {}
