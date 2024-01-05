import {Region, StoreFileExtension, StoreFileType} from '@alwatr/store-engine';


import {chat} from '../lib/openai-api';
import {nanoServer} from '../lib/server';
import {store} from '../lib/store';

import type {AlwatrServiceResponse, StringifyableRecord} from '@alwatr/type';
import type {ChatCompletionMessageParam} from 'openai/resources/index.mjs';

/**
 * PUT `/conversation` create a new conversation.
 *
 * 1. Create a new conversation.
 * 2. Create a new collection for the conversation.
 * 3. Append a welcome message to the conversation.
 *.
 * @param searchParams user id.
 * @returns conversation id.
 */
nanoServer.route<StringifyableRecord>('PUT', '/conversation', async (connection): Promise<AlwatrServiceResponse> => {
  const params = connection.requireQueryParams<{userId: string}>({userId: 'string'});

  const message: ChatCompletionMessageParam = {
    role: 'system',
    content: 'You are a helpful assistant that can help you to keep note on your life and help you to remember them when you need them.',
  };
  const response = await chat([message], 'gpt-3.5-turbo');

  store.defineStoreFile({
    name: 'conversation/' + response.id,
    ownerId: params.userId,
    type: StoreFileType.Collection,
    extension: StoreFileExtension.Json,
    region: Region.PerUser,
  });

  const conversationCollection = await store.collection<ChatCompletionMessageParam>({
    name: 'conversation/' + response.id,
    ownerId: params.userId,
    region: Region.PerUser,
  });

  conversationCollection.append(message);

  conversationCollection.save();
  return {
    ok: true,
    data: {
      conversationId: response.id,
    },
  };
});
