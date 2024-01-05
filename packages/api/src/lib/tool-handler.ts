import { addNote, createAccount, deleteAccount, getNoteList } from './tools.js';

import type {Dictionary} from '@alwatr/type-helper';

/**
 * Handle tool call from openai
 *
 * @param functionName tool call function name
 * @param argument tool call argument
 * @returns tool call content
 *
 * @example
 * ```ts
 * const content = await handleToolCall('create_account', {userId: 'user_id'});
 * ```
 */
export async function handleToolCall(functionName: string, argument: Dictionary): Promise<string> {
  let callContent = '';
  if (functionName === 'create_account') {
    const isNew = createAccount(argument.userId as string);
    if (isNew) {
      callContent = 'successfully created';
    }
    else {
      callContent = 'this account created before, so user can work with notes';
    }
  }
  else if (functionName === 'add_note') {
    await addNote(argument.userId as string, argument.note as string);
    callContent = 'successfully added';
  }
  else if (functionName === 'delete_account') {
    const deleted = await deleteAccount(argument.userId as string);
    if (deleted) {
      callContent = 'successfully deleted';
    }
    else {
      callContent = 'this account not found';
    }
  }
  if (functionName === 'get_note_list') {
    const list = await getNoteList(argument.userId as string);
    callContent = 'this is list of notes: ' + JSON.stringify(list);
  }
  return callContent;
}
