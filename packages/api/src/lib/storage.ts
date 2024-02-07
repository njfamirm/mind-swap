import {AlwatrStorage} from '@alwatr/storage-sdk';

import {config} from './config.js';

export const storageClient = new AlwatrStorage(config.storageClient);
