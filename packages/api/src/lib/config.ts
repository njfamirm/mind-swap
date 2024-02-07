import {definePackage} from '@alwatr/logger';

import type {} from '@alwatr/nano-build';

export const logger = definePackage('@njfamirm/mind-swap-api', __package_version__);

export const config = {
  store: {
    rootPath: './db',
    defaultChangeDebounce: 50,
    // errorWhenNotInitialized: true,
  },

  nanoServer: {
    host: process.env.HOST ?? '0.0.0.0',
    port: process.env.PORT != null ? +process.env.PORT : 8000,
    // allowAllOrigin: true,
  },

  openai: {
    apiKey: process.env.OPENAI_API_KEY,
  },
} as const;

logger.logProperty?.('config', config);
