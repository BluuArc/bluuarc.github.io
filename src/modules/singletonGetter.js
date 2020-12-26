/**
 * @desc Create a function that lazily creates an instance of whatever
 * the getter returns.
 * @param {() => *} getter Synchronous getter function to cache the return value of.
 * Should not return undefined.
 * @returns {(reload?: boolean) => *} Resulting getter function for the singleton.
 */
export function createSingletonGetter(getter) {
	let instance;
	return (reload) => {
		if (reload || typeof instance === 'undefined') {
			instance = getter();
		}
		return instance;
	}
}

/**
 * @desc Create a function that lazily creates an instance of whatever
 * the getter returns asynchronously.
 * @param {() => *} getter Asynchronous getter function to cache the return value of.
 * Should not return undefined.
 * @returns {(reload?: boolean) => Promise<*>} Resulting getter function for the singleton.
 */
export function createSingletonGetterAsync(getter) {
	let instance;
	return async (reload) => {
		if (reload || typeof instance === 'undefined') {
			instance = await getter();
		}
		return instance;
	}
}
