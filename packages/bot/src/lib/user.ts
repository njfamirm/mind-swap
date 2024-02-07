import {StoreFileExtension, Region, StoreFileType} from '@alwatr/store-engine';

import {store} from './store.js';

const userCollectionId = {
  extension: StoreFileExtension.Json,
  name: 'user',
  region: Region.Managers,
  type: StoreFileType.Collection,
};

if (!store.exists(userCollectionId)) {
  store.defineStoreFile(userCollectionId);
}

export const userCollection = await store.collection<{conversationId: string}>(userCollectionId);
