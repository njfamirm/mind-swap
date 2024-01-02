import {newConversation} from '../lib/chat.js';
import {nanoServer} from '../lib/server.js';

import type {StringifyableRecord} from '@alwatr/type';

/**
 * PUT `/conversation` create a new conversation.
 *.
 * @param searchParams user id.
 *
 * @returns conversation id.
 */
nanoServer.route<StringifyableRecord>('PUT', '/conversation', async (connection) => {
  const param = connection.requireQueryParams<{userId: string}>({userId: 'string'});

  const conversationId = await newConversation(param.userId, 'gpt-3.5-turbo');

  return {
    ok: true,
    data: {conversationId},
  };
});
