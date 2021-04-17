interface ExtendedConsole extends Console {
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
