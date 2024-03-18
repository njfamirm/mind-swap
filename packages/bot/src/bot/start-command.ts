import {fetchJson} from '@alwatr/fetch';

import {bot} from '../lib/bot.js';
import {config, logger} from '../lib/config.js';
import {userCollection} from '../lib/user.js';

import type {AlwatrServiceResponse} from '@alwatr/type';

/**
 * Command `/start` is used to initialize the user account.
 *
 * 1. If the user account does not exist, create a new account.
 *   1.1. Create a new conversation in the chat API.
 *   1.2. Create a new user account in the store with the conversation ID.
 * 2. If the user account exists, welcome the user.
 */
bot.command('start', async (ctx) => {
  logger.logMethodArgs?.('start', {userId: ctx.from?.id});
  if (ctx.from == null) return;

  if (!userCollection.exists(ctx.from.id)) {
    const message = await ctx.reply('Initializing Your Mind Swap account 🧠');
    const response = await fetchJson<AlwatrServiceResponse<{conversationId: string}>>({
      url: config.api.newConversation,
      method: 'PUT',
      timeout: 60_000,
      retry: 0,
      queryParameters: {
        userId: ctx.from.id.toString(),
      },
    });

    if (response.ok === false) {
      logger.error('command-start', 'create_conversation_failed');
      return;
    }

    userCollection.create(ctx.from.id.toString(), {
      conversationId: response.data.conversationId,
    });

    await ctx.api.editMessageText(ctx.chat.id, message.message_id, 'Your Mind Swap account created 🧠🎉');
  }
  else {
    await ctx.reply('Welcome to Mind Swap 🧠');
  }
});
