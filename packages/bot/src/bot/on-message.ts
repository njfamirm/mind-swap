import {fetchJson} from '@alwatr/fetch';

import {bot} from '../lib/bot.js';
import {config, logger} from '../lib/config.js';
import {userCollection} from '../lib/user.js';

import type {AlwatrServiceResponse} from '@alwatr/type';

bot.on('message', async (ctx) => {
  logger.logMethodArgs?.('on-message', {userId: ctx.from.id});

  const conversationId = userCollection.get(ctx.from.id).conversationId;

  const message = await ctx.reply('🧠 Processing...');
  const response = await fetchJson<AlwatrServiceResponse<{content: string; role: string}>>({
    url: config.api.chat,
    method: 'PATCH',
    timeout: 60_000,
    retry: 0,
    bodyJson: {
      message: ctx.message.text,
    },
    queryParameters: {userId: ctx.from.id.toString(), conversationId},
  });

  if (!response.ok) {
    logger.error('command-start', 'create_conversation_failed');
    return;
  }

  await ctx.api.editMessageText(ctx.chat.id, message.message_id, response.data.content);
});
