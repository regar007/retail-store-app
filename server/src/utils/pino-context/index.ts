const als = require('async-local-storage');
import { createWrapper } from './wrapper';
import pino from 'pino';

const CONTEXT_NAME = 'pino-context';

als.enable();

// Override the default logger to add the http-context of logger
const logMethodHandler = (options: any) => (target: any) => (...args: any[]) => {
    const { showWhenEmpty = false } = options;
    const context = als.get(CONTEXT_NAME) || {};

    if (!showWhenEmpty && Object.keys(context).length === 0) {
        return target(...args);
    }

    const [firstArg, ...rest] = args;
    let finalArgList;

    if (typeof firstArg === 'string') {
        // Log was called only with message, no local context
        finalArgList = [{ context }, firstArg, ...rest];
    } else {
        // Log was called local context, so we merge it into clsContext
        finalArgList = [{ context, ...firstArg }, ...rest];
    }

    return target(...finalArgList);
};

/**
 *
 * @param {object} instance A pino instance
 * @param {object} options
 * @param {boolean} options.showWhenEmpty Add the context object to each log even if empty
 */
export const wrapLogger = (instance: pino.Logger, options = {}): pino.Logger => {
    if (!instance) {
        throw new Error('A pino instance must be provided');
    }

    return createWrapper(instance, logMethodHandler(options));
};

/**
 * Add a key to the context object
 * @param {string} key
 * @param {*} value
 */
export const addContext = (key: any, value: any) => {
    const context = als.get(CONTEXT_NAME);

    als.set(CONTEXT_NAME, { ...context, [key]: value });
};
