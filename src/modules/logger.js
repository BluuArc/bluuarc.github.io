import { createSingletonGetter } from './singletonGetter';
import { getValueFromSessionStorage, setValueOnSessionStorage, getAppContextFromWindow } from './appContextManager';

const LOGGER_FLAG_KEY = 'showLogMessages';
const DEFAULT_STYLING = 'font-weight:bold;background:black;color:#999999;text-decoration:underline;';
const loggingFunctionsWithPrefix = ['log', 'debug', 'warn', 'error', 'info'];
let timeSinceLastRetrieval = Date.now();
const showLogMessages = createSingletonGetter(() => {
	timeSinceLastRetrieval = Date.now();
	return getValueFromSessionStorage(LOGGER_FLAG_KEY) === 'true';
});
const noop = () => {};

getAppContextFromWindow().setLoggingState = setLoggingState;

export function setLoggingState (doLog) {
	setValueOnSessionStorage(LOGGER_FLAG_KEY, !!doLog);
}

export function createLogger (contextName) {
	const propMapping = new Map();
	const consoleProxy = new Proxy(self.console, {
		get: function (target, prop) {
			let result;
			if (loggingFunctionsWithPrefix.includes(prop)) {
				const doShowLogMessages = showLogMessages(Date.now() - timeSinceLastRetrieval > 100);
				if (!doShowLogMessages) {
					result = noop;
				} else if (propMapping.has(prop)) {
					result = propMapping.get(prop);
				} else {
					result = target[prop].bind(target, `%c[${contextName}]`, DEFAULT_STYLING);
					propMapping.set(prop, result);
				}
			} else {
				result = target[prop];
			}
			return result;
		},
	});

	return consoleProxy;
}
