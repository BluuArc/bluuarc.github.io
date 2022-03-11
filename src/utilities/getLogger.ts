interface ExtendedConsole extends Console {
	/**
	 * @description Create a logger under the exsiting logger context. Resulting key used in log labels is `${currentKey}.${subKey}`
	 * @param subKey Unique identifier to use for sub logger. Typical usage is to key by context or component. Loggers are cached.
	 * @param styling Styling to apply to the label for each log message. If not specified, styling is inherited from parent logger.
	 * @returns Logger for given key + sub-key.
	 */
	createSubLogger: (subKey: string, styling?: string) => ExtendedConsole;
}

const KEYED_LOGGING_FUNCTIONS = [
	'info',
	'log',
	'error',
	'warn',
	'debug',
];
const DEFAULT_STYLING = 'font-weight:bold;background:black;color:white;text-decoration:underline;';
const CREATE_SUB_LOGGER_METHOD_NAME = 'createSubLogger';
const proxyMapping = new Map<string, ExtendedConsole>();

/**
 * @description Get or create a console logger based on the given key.
 * @param key Unique identifier for a logger. Typical usage is to key by context or component. Loggers are cached.
 * @param styling Styling to apply to the label for each log message. Default styling is bolded white underlined text on a black background.
 * @param targetConsoleObject Object to use as the base for console logs. Default is the global `console` object
 * @returns Logger for given key.
 */
export function getLogger(key: string, styling = DEFAULT_STYLING, targetConsoleObject = console): ExtendedConsole {
	let logger = proxyMapping.get(key);
	if (!logger) {
		logger = new Proxy(targetConsoleObject as ExtendedConsole, {
			get (obj: ExtendedConsole, prop: string) {
				let result;
				if (prop === CREATE_SUB_LOGGER_METHOD_NAME) {
					result = (subKey: string, subStyling?: string) => getLogger(`${key}.${subKey}`, subStyling || styling, targetConsoleObject);
				} else if (KEYED_LOGGING_FUNCTIONS.includes(prop)) {
					const originalFunction: (...args: any[]) => undefined = obj[prop];
					result = originalFunction.bind(targetConsoleObject, `%c[${key}:${prop}]`, styling);
				} else {
					result = obj[prop];
				}
				return result;
			}
		});
		proxyMapping.set(key, logger);
	}
	return logger;
}
