import './bot/start-command.js';
// eslint-disable-next-line import/order
import './bot/on-message.js';
import {bot} from './lib/bot.js';
import {logger} from './lib/config.js';
import './lib/user.js';

logger.banner('mind-swap-bot');

bot.start();
