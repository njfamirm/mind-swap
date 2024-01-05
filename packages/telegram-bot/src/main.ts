import './bot/on-message';
import './bot/start-command.js';
import { bot } from './lib/bot.js';
import {logger} from './lib/config';

logger.banner('mind-swap-bot');

bot.start()
