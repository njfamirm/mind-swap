import {definePackage} from '@alwatr/logger';

import type {} from '@alwatr/nano-build';

export const logger = definePackage('@njfamirm/mind-swap-bot', __package_version__);

if (process.env.botToken == null) {
  throw new Error('botToken is required.');
}

const apiBaseUrl = process.env.apiBaseUrl
if (apiBaseUrl == null) {
  throw new Error('apiBaseUrl is required.');
}

if (process.env.NODE_ENV === 'production') {
  if (process.env.storeEngineRootPath == null) {
    throw new Error('storeEngineRootPath is required in production.');
  }
}

export const config = {
  storeEngine: {
    rootPath: process.env.storeEngineRootPath ?? './data',
    defaultChangeDebounce: 50,
  },

  bot: {
    token: process.env.botToken as string,
  },

  api: {
    newConversation: apiBaseUrl + '/conversation',
    chat: apiBaseUrl + '/chat',
  },
} as const;

logger.logProperty?.('config', config);
