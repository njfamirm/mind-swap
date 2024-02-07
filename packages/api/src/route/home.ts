import {nanoServer} from '../lib/server.js';

import type {StringifyableRecord} from '@alwatr/type';

nanoServer.route<StringifyableRecord>('GET', '/', () => ({
  ok: true,
  data: {
    app: '..:: Mind Swap API ::..',
    message: 'Hello ;)',
  },
}));
