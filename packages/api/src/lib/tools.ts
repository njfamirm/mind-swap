import {Region, StoreFileExtension, StoreFileType} from '@alwatr/store-engine';

import {logger} from './config';
import {store} from './store';

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
