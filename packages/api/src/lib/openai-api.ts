import {OpenAI} from 'openai';

import {config, logger} from './config';

import type {Model} from '../type';
import type {ChatCompletion, ChatCompletionMessageParam, ChatCompletionTool} from 'openai/resources/chat/index';

export const openai = new OpenAI({
  apiKey: config.openai.apiKey,
});

export async function chat(messages: ChatCompletionMessageParam[], model: Model, tools?: ChatCompletionTool[]): Promise<ChatCompletion> {
  logger.logMethodArgs?.('chat', messages[messages.length - 1]);
  const completion = await openai.chat.completions.create({
    messages,
    model,
    tools,
    tool_choice: tools !== undefined ? 'auto' : undefined,
  });

  return completion;
}
