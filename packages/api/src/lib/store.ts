import {AlwatrStore} from '@alwatr/store-engine';

import {config} from './config.js';

export const store = new AlwatrStore(config.store);
