import './bot/start-command';
// eslint-disable-next-line import/order
import './bot/on-message';
import {bot} from './lib/bot';
import {logger} from './lib/config';
import './lib/user'

logger.banner('mind-swap-bot');

bot.start();
