import { InjectBot, Start, Update, Action } from 'nestjs-telegraf';
import { Context, Telegraf, Markup } from 'telegraf';
import { InputFile } from 'telegraf/typings/core/types/typegram';

@Update()
export class BotUpdate {
  constructor(@InjectBot() private readonly bot: Telegraf<Context>) {}

  @Start()
  async startCommand(ctx: Context) {
    console.log('inside start');

    const chat = await ctx.getChat();

    const hello: String =
      ctx.message.from.language_code === 'ru' ? 'Привет' : 'Hello';
    const getChatId: String =
      ctx.message.from.language_code === 'ru'
        ? 'Получить ID чата 🕹️'
        : 'Get chat ID 🕹️';

    await this.bot.telegram.sendMessage(
      chat.id,
      `${hello}, ${ctx.message.from.first_name} 👋`,
      Markup.inlineKeyboard([
        Markup.button.callback(`${getChatId}`, 'getChatId'),
      ]),
    );
  }

  @Action('getChatId')
  async getChatId(ctx: any) {
    const yourChatId: String =
      ctx.update.callback_query.from.language_code === 'ru'
        ? 'Ваш ID чата:'
        : 'Your chat ID:';

    const chat = await ctx.getChat();

    return `${yourChatId} ${chat.id}`;
  }

  @Action('sendMessage')
  async sendMessage(chatId: string, msg: string, photo?: string | InputFile) {
    photo && this.bot.telegram.sendPhoto(chatId, photo);
    await this.bot.telegram.sendMessage(chatId, msg);
  }
  async sendPhoto(chatId: string, photo: string | InputFile) {
    await this.bot.telegram.sendPhoto(chatId, photo);
  }
}
