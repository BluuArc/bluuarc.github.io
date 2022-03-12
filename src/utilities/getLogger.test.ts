import { getLogger, IExtendedConsole, _context } from './getLogger';

describe('getLogger', () => {
	const EXPECTED_OVERRIDDEN_LOGGING_FUNCTIONS = [
		'info',
		'log',
		'error',
		'warn',
		'debug',
	];
	let mockConsole: Partial<Console>;
	const ARBITRARY_LOGGER_KEY = 'arbitraryLoggerKey';
	const ARBITRARY_STYLING_STRING = 'font-family: "Test Font",sans-serif;';
	const ARBITRARY_LOG_MESSAGE = 'This a message to test the logging functionality';

	const testOverriddenLoggerFunctionsWithKeyAndLoggerFactory = (expectedKey: string, loggerFactory: () => IExtendedConsole) => {
		EXPECTED_OVERRIDDEN_LOGGING_FUNCTIONS.forEach((name) => {
			describe(`overridden console function [${name}]`, () => {
				test(`is present on returned logger object`, () => {
					const logger = loggerFactory();
					expect(typeof logger[name]).toBe('function');
					expect(logger[name]).not.toBe(mockConsole[name]);
				});
	
				test(`is called with specified label "[${expectedKey}:${name}]", style [${ARBITRARY_STYLING_STRING}], and log message [${ARBITRARY_LOG_MESSAGE}]`, () => {
					const logger = loggerFactory();
					const overriddenLoggerFunction = logger[name] as typeof console.log;
					overriddenLoggerFunction(ARBITRARY_LOG_MESSAGE);
	
					const expectedLabel = `%c[${expectedKey}:${name}]`;
					expect(mockConsole[name]).toBeCalledWith(expectedLabel, ARBITRARY_STYLING_STRING, ARBITRARY_LOG_MESSAGE);
				});
			});
		});
	};

	beforeEach(() => {
		_context.proxyMapping = new Map<string, IExtendedConsole>();

		mockConsole = {};
		EXPECTED_OVERRIDDEN_LOGGING_FUNCTIONS.forEach((name) => {
			mockConsole[name] = jest.fn().mockName(`${name}Mock`);
		});
	});

	afterAll(() => {
		_context.proxyMapping = new Map<string, IExtendedConsole>();
	});

	testOverriddenLoggerFunctionsWithKeyAndLoggerFactory(
		ARBITRARY_LOGGER_KEY,
		() => getLogger(ARBITRARY_LOGGER_KEY, ARBITRARY_STYLING_STRING, mockConsole as Console)
	);

	describe('getSubLogger', () => {
		const ARBITRARY_SUB_LOGGER_KEY = 'arbitrarySubLoggerKey';
		test('returns a different logger object', () => {
			const logger = getLogger(ARBITRARY_LOGGER_KEY, ARBITRARY_STYLING_STRING, mockConsole as Console);
			const subLogger = logger.getSubLogger(ARBITRARY_SUB_LOGGER_KEY);
			expect(logger).not.toBe(subLogger);
		});

		testOverriddenLoggerFunctionsWithKeyAndLoggerFactory(
			`${ARBITRARY_LOGGER_KEY}.${ARBITRARY_SUB_LOGGER_KEY}`,
			() => {
				const logger = getLogger(ARBITRARY_LOGGER_KEY, ARBITRARY_STYLING_STRING, mockConsole as Console);
				return logger.getSubLogger(ARBITRARY_SUB_LOGGER_KEY);
			}
		);

		test('allows overridden styling on the sub logger', () => {
			const anotherArbitraryStyleString = 'font-family: "Another Test Font",serif;';
			const logger = getLogger(ARBITRARY_LOGGER_KEY, ARBITRARY_STYLING_STRING, mockConsole as Console);
			const subLogger = logger.getSubLogger(ARBITRARY_SUB_LOGGER_KEY, anotherArbitraryStyleString);

			subLogger.log(ARBITRARY_LOG_MESSAGE);
			expect(mockConsole.log).toHaveBeenCalledWith(
				expect.stringContaining(ARBITRARY_SUB_LOGGER_KEY),
				anotherArbitraryStyleString,
				ARBITRARY_LOG_MESSAGE
			);
		})
	});

	test('returns logger object that returns original property on console object if the property is not overridden', () => {
		const logger = getLogger(ARBITRARY_LOGGER_KEY);
		expect(logger.table).toBe(console.table);
	});

	test('returns same logger object if the same key is used', () => {
		const logger = getLogger(ARBITRARY_LOGGER_KEY);
		const secondLogger = getLogger(ARBITRARY_LOGGER_KEY);
		expect(logger).toBe(secondLogger);
	});

	test('returns different logger objects for different keys', () => {
		const logger = getLogger(ARBITRARY_LOGGER_KEY);
		const secondLogger = getLogger(`${ARBITRARY_LOGGER_KEY}-2`);
		expect(logger).not.toBe(secondLogger);
	});
});