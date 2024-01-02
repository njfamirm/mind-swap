import {Region, StoreFileExtension, StoreFileType} from '@alwatr/store-engine';

import {logger} from './config';
import {openai} from './openai';
import {store} from './store.js';

import type {Model} from '../type';
import type {ChatCompletion, ChatCompletionMessageParam} from 'openai/resources/chat/index';

export async function chat(messages: ChatCompletionMessageParam[], model: Model): Promise<ChatCompletion> {
  logger.logMethodArgs?.('chat', messages[messages.length - 1]);
  const completion = await openai.chat.completions.create({messages, model});
  return completion;
}

export async function newConversation(userId: string, model: Model) {
  const message: ChatCompletionMessageParam = {role: 'system', content: 'You are a helpful assistant.'}
  const response = await chat([message], model);
  store.defineStoreFile({
    name: 'conversation/' + response.id,
    ownerId: userId,
    type: StoreFileType.Collection,
    extension: StoreFileExtension.Json,
    region: Region.PerUser,
  });

  await appendToConversation(userId, response.id, response.choices[0].message)
  return response.id;
}

export async function appendToConversation(
  userId: string,
  conversationId: string,
  messages: ChatCompletionMessageParam,
): Promise<ChatCompletionMessageParam[]> {
  const conversationCollection = await store.collection<ChatCompletionMessageParam>({
    name: 'conversation/' + conversationId,
    ownerId: userId,
    region: Region.PerUser,
  });

  conversationCollection.append(messages);

  return conversationCollection.values().map((item) => item.data);
}
