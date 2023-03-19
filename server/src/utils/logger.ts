import pino from 'pino';
import { BUFFER_ASYNC_FLUSH_LENGTH, LOG_LEVEL } from './config';


import { wrapLogger } from './pino-context';

    const _logger = pino(
    {
        name: 'retail-store',
        base: null,
        customLevels: {
            emergency: 0,
            alert: 1,
            critical: 2,
            error: 3,
            warning: 4,
            notice: 5,
            info: 6,
            debug: 7,
        },
        useOnlyCustomLevels: true,
        safe: true,
        level: LOG_LEVEL || 'emergency',
        timestamp: pino.stdTimeFunctions.isoTime,
    },
    
);

const logger = wrapLogger(_logger);

// asynchronously flush every 10 seconds to keep the buffer empty
// in periods of low activity
setInterval(function() {
    logger.flush();
}, ((BUFFER_ASYNC_FLUSH_LENGTH as unknown) as number) || 10000).unref();

export default logger;
