import {definePackage} from '@alwatr/logger';

import type {} from '@alwatr/nano-build';

export const logger = definePackage('mind-swap-api', __package_version__);



if (process.env.NODE_ENV === 'production') {
  if (process.env.BOT_TOKEN == null) {
    throw new Error('BOT_TOKEN is required in production');
  }
}

export const config = {
  storeEngine: {
    rootPath: './db',
    defaultChangeDebounce: 50,
  },

  bot: {
    token: process.env.BOT_TOKEN as string,
  },

  chatApi: {
    baseUrl: process.env.CHAT_API_BASE_URL,
    token: process.env.CHAT_API_TOKEN,
  },

  botMessage: {
    start: 'hi!',
  },
} as const;

logger.logProperty?.('config', config);
