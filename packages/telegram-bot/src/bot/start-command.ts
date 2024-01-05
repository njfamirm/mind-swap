import {bot} from '../lib/bot';
import {config} from '../lib/config';

bot.command('start', async (ctx) => {
  await ctx.reply(config.botMessage.start);
});
