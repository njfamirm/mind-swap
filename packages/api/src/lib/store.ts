import {AlwatrStore} from '@alwatr/store-engine';

import {config} from './config';

export const store = new AlwatrStore(config.storeEngine);
