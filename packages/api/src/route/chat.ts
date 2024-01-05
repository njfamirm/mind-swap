import {Region} from '@alwatr/store-engine';

import {chat} from '../lib/openai-api';
import {nanoServer} from '../lib/server';
import {store} from '../lib/store';
import {handleToolCall} from '../lib/tool-handler';
import {chatToolList} from '../lib/tools';

import type {AlwatrServiceResponse, StringifyableRecord} from '@alwatr/type';
import type {ChatCompletionMessageParam} from 'openai/resources/index';

/**
 * PATCH `/chat` Chat with the AI.
 *
 * 1. Check conversation exists.
 * 2. Add user message to conversation.
 * 3. Chat with AI and append AI message to conversation.
 * 4. If AI message is tool call, handle them.
 *   4.1. send call content to AI and append AI message to conversation.
 *
 * @param bodyJson last message from conversation.
 * @param searchParams user id.
 *
 * @returns message and role.
 */
nanoServer.route<StringifyableRecord>('PATCH', '/chat', async (connection): Promise<AlwatrServiceResponse> => {
  const body = await connection.requireJsonBody<{message: string}>();
  const param = connection.requireQueryParams<{userId: string; conversationId: string}>({userId: 'string', conversationId: 'string'});

  const collectionId = {
    name: 'conversation/' + param.conversationId,
    ownerId: param.userId,
    region: Region.PerUser,
  };

  if (!store.exists(collectionId)) {
    throw {
      ok: false,
      errorCode: 'conversation_not_found',
      statusCode: 400,
    };
  }

  const conversationCollection = await store.collection<ChatCompletionMessageParam>(collectionId);
  const conversationList = () => conversationCollection.values().map((item) => item.data);

  conversationCollection.append({role: 'user', content: body.message});

  let response = await chat(conversationList(), 'gpt-3.5-turbo', chatToolList);
  conversationCollection.append(response.choices[0].message);

  if (response.choices[0].finish_reason === 'tool_calls') {
    const toolCall = response.choices[0].message.tool_calls?.[0];
    if (toolCall != null) {
      const argument = JSON.parse(toolCall.function.arguments);
      const functionName = toolCall.function.name;

      let callContent;
      try {
        callContent = await handleToolCall(functionName, argument);
      }
      catch (error) {
        callContent = 'Error occurred: ' + JSON.stringify(error);
      }

      conversationCollection.append({
        role: 'tool',
        content: callContent,
        tool_call_id: toolCall.id,
      });

      response = await chat(conversationList(), 'gpt-3.5-turbo', chatToolList);
      conversationCollection.append(response.choices[0].message);
    }
  }

  conversationCollection.save();

  return {
    ok: true,
    data: {
      content: response.choices[0].message.content,
      role: response.choices[0].message.role,
    },
  };
});
