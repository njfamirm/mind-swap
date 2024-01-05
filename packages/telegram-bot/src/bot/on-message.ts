import {bot} from '../lib/bot.js';

bot.on('message', async (ctx) => {
  await ctx.reply('Hello!');
});
