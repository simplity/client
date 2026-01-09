import { Logger } from '@simplity';
/**
 * A simple console logger implementation.
 */
export const logger: Logger = {
  info: console.log.bind(console, '[INFO]'),
  error: console.error.bind(console, '[ERROR]'),
  warn: console.warn.bind(console, '[WARN]'),
  debug: console.debug.bind(console, '[DEBUG]'),
};
