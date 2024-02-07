import {Region} from '@alwatr/store-engine';

import {logger} from './config.js';
import {store} from './store.js';

import type {ChatCompletionTool} from 'openai/resources/index.mjs';

/**
 * Tools for chat with AI
 */
export const chatToolList: ChatCompletionTool[] = [
  {
    type: 'function',
    function: {
      name: 'get_note_list',
      description: 'Get user note from db and send them to user a as table',
      parameters: {},
    },
  },
  {
    type: 'function',
    function: {
      name: 'add_note',
      description: 'Get note from user and organize them and send plain text note',
      parameters: {
        type: 'object',
        properties: {
          note: {
            type: 'string',
            description: 'Organized note from user in plain text',
          },
        },
        required: ['note'],
      },
    },
  },
];

/**
 * Add note to user account
 *
 * @param userId user id
 * @param note note
 * @returns tool call content
 *
 * @example
 * ```ts
 * const content = await addNote('user_id', 'note');
 * ```
 */
export async function addNote(userId: string, note: string): Promise<string> {
  logger.logMethodArgs?.('addNote', {userId, note});
  const noteCollection = await store.collection<{note: string}>({
    name: 'note',
    region: Region.PerUser,
    ownerId: userId,
  });

  noteCollection.append({note});

  return `note added successfully: "${note}"`;
}

/**
 * Get note list from user account
 *
 * @param userId user id
 * @returns note list
 *
 * @example
 * ```ts
 * const noteList = await getNoteList('user_id');
 * ```
 */
export async function getNoteList(userId: string): Promise<string[]> {
  logger.logMethodArgs?.('getNoteList', userId);
  const noteCollection = await store.collection<{note: string}>({
    name: 'note',
    region: Region.PerUser,
    ownerId: userId,
  });

  return noteCollection.values().map((note) => note.data.note);
}
