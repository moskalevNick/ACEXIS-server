import { Injectable } from '@nestjs/common';
import { InjectBot, Start, Update, Action } from 'nestjs-telegraf';
import { Context, Telegraf, Markup } from 'telegraf';

@Injectable()
export class BotService {
  constructor(@InjectBot() private readonly bot: Telegraf<Context>) {}
  async sendMessage(msg: string) {}
}
