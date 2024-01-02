import {appendToConversation, chat} from '../lib/chat.js';
import {nanoServer} from '../lib/server';

import type {StringifyableRecord} from '@alwatr/type';

/**
 * GET `/chat` Chat with the AI.
 *
 * @param bodyJson last message from conversation.
 * @param searchParams user id.
 *
 * @returns `ChatCompletion.Choice` from OpenAI.
 */
nanoServer.route<StringifyableRecord>('PATCH', '/chat', async (connection) => {
  const body = await connection.requireJsonBody<{message: string}>();
  const param = connection.requireQueryParams<{userId: string; conversationId: string}>({userId: 'string', conversationId: 'string'});

  const conversation = await appendToConversation(param.userId, param.conversationId, {
    role: 'user',
    content: body.message,
  });

  const response = await chat(conversation, 'gpt-3.5-turbo');

  await appendToConversation(param.userId, param.conversationId, response.choices[0].message);

  return {
    ok: true,
    data: response,
  };
});
