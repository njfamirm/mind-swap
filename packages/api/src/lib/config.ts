import {createLogger, definePackage} from '@alwatr/logger';

definePackage('pmpa-api', '0.x');

export const logger = createLogger('@alwatr/pmpa-api');

if (process.env.NODE_ENV === 'production') {
  if (process.env.STORAGE_TOKEN == null) {
    throw new Error('STORAGE_TOKEN is required in production');
  }
}

export const config = {
  storeEngine: {
    rootPath: './db',
    defaultChangeDebounce: 50,
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
