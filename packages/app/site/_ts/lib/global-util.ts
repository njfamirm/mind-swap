import {l10n} from '@alwatr/i18n';

import {logger} from './config.js';

logger.logModule?.('global-util');

declare global {
  interface Window {
    l10n: typeof l10n;
    clearLocalStorage: typeof clearLocalStorage;
    devMode: typeof devMode;
  }
}

l10n.setResourceLoader((locale) => {
  return {
    ok: true,
    meta: {
      code: locale.code,
      rev: 0,
    },
    data: {},
  };
});

l10n.setLocale('auto');

export function clearLocalStorage() {
  logger.logMethod?.('clearLocalStorage');
  localStorage.clear();
  if (logger.devMode) {
    localStorage.setItem('alwatrDebug', '1');
  }
}

export function devMode() {
  logger.logMethod?.('devMode');
  localStorage.setItem('alwatrDebug', '1');
  location.reload();
}

window.l10n = l10n;
window.clearLocalStorage = clearLocalStorage;
window.devMode = devMode;
