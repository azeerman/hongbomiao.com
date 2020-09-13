import fluentLogger from 'fluent-logger';
import winston, { createLogger } from 'winston';
import SentryTransport from 'winston-transport-sentry-node';
import Config from '../../Config';
import isDevelopment from '../../shared/utils/isDevelopment';

const FluentTransport = fluentLogger.support.winstonTransport();

const logger = createLogger({
  transports: [
    new winston.transports.Console({ level: 'info' }),
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    new SentryTransport(Config.sentryOptions),

    ...(isDevelopment() ? [new FluentTransport('server-tag', Config.fluentBitConfig)] : []),
  ],
});

export default logger;
