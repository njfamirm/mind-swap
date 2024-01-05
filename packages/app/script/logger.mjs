import {createLogger, definePackage} from '@alwatr/logger';
definePackage('mind-swap-app/11ty', '0.x');

export const logger = createLogger('mind-swap-app', true);

export const devMode = process.env.NODE_ENV !== 'production';
logger.logProperty?.('devMode', devMode);
