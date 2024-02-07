import {untilNextFrame} from '@alwatr/util';

import {logger} from './config.js';

async function keepScroll() {
  const container = document.querySelector('main.overflow-y-scroll');
  if (!container) return;

  await untilNextFrame();

  const scrollPosition = localStorage.getItem('scrollPosition');
  logger.logMethodArgs?.('restoreScrollPosition', scrollPosition);
  if (scrollPosition) {
    container.scrollTo({
      top: +scrollPosition,
      behavior: 'smooth',
    });
  }

  window.addEventListener('unload', () => {
    const scrollPosition = container.scrollTop.toString();
    logger.logMethodArgs?.('saveScrollPosition', scrollPosition);
    localStorage.setItem('scrollPosition', scrollPosition);
  });
}

if (logger.devMode) keepScroll();
