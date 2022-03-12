/**
 * Mock the getLogger import for easier unit testing and to avoid
 * random console logs from the original getLogger implementation.
 * 
 * **IMPORTANT:** Must import above imports that use getLogger.
 */

type MockedLoggerKeys = 'warn';
let mockLogger: Record<MockedLoggerKeys, jest.MockedFunction<typeof console.log>>;

jest.mock('@src/utilities/getLogger', () => ({ getLogger: getMockLogger }));

export function getMockLogger() {
	if (!mockLogger) {
		mockLogger = {
			warn: jest.fn().mockName('mockWarn')
		};
	}
	return mockLogger;
}

export function resetLoggerMocks() {
	if (mockLogger) {
		mockLogger.warn.mockClear();
	}
}