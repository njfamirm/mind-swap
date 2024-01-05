import {Region, StoreFileExtension, StoreFileType} from '@alwatr/store-engine';


import {logger} from './config';
import {store} from './store';

import type {ChatCompletionTool} from 'openai/resources/index.mjs';

/**
 * Tools for chat with AI
 */
export const chatToolList: ChatCompletionTool[] = [
  {
    type: 'function',
    function: {
      name: 'create_account',
      description: 'At first user must create account to keep note on them',
      parameters: {
        type: 'object',
        properties: {
          userId: {
            type: 'string',
            description: "User id that's can be get from user, must don't use @ in them",
          },
        },
        required: ['userId'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'delete_account',
      description: 'Delete user if user want',
      parameters: {
        type: 'object',
        properties: {
          userId: {
            type: 'string',
            description: "User id that's can be get from user, must don't use @ in them",
          },
        },
        required: ['userId'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'get_note_list',
      description: 'Get user note from db and send them to user a as table',
      parameters: {
        type: 'object',
        properties: {
          userId: {
            type: 'string',
            description: "User id that's can be get from user, must don't use @ in them",
          },
        },
        required: ['userId'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'add_note',
      description: 'Get note from user and organize them and send plain text note ',
      parameters: {
        type: 'object',
        properties: {
          userId: {
            type: 'string',
            description: "User id that's can be get from user",
          },
          note: {
            type: 'string',
            description: 'Organized note from user in plain text',
          },
        },
        required: ['userId', 'note'],
      },
    },
  },
];

/**
 * Create account for user
 *
 * @param userId user id
 * @returns tool call content
 *
 * @example
 * ```ts
 * const content = createAccount('user_id');
 * ```
 */
export function createAccount(userId: string): string {
  logger.logMethodArgs?.('createAccount', userId);
  if (!store.exists({name: 'note', region: Region.PerUser, ownerId: userId})) {
    store.defineStoreFile({
      name: 'note',
      extension: StoreFileExtension.Json,
      region: Region.PerUser,
      type: StoreFileType.Collection,
      ownerId: userId,
    });

    return 'account created successfully';
  }

  return 'this account created before, so user can work with notes';
}

/**
 * Delete account for user
 *
 * @param userId user id
 * @returns tool call content
 *
 * @example
 * ```ts
 * const content = await deleteAccount('user_id');
 * ```
 */
export async function deleteAccount(userId: string): Promise<string> {
  logger.logMethodArgs?.('deleteAccount', userId);
  if (store.exists({name: 'note', region: Region.PerUser, ownerId: userId})) {
    await store.deleteFile({
      name: 'note',
      region: Region.PerUser,
      ownerId: userId,
    });

    return 'account deleted successfully, so user can must create new account for work with notes';
  }

  return 'this account not found';
}

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
