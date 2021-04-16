/**
 * @desc Create a function that lazily creates an instance of whatever the getter returns.
 * @param getter Synchronous getter function to cache the return value of. Should not return undefined.
 * @returns Resulting getter function for the singleton.
 */
export function createSingletonGetter<T>(getter: () => T): (reload?: boolean) => T {
	let instance: T;
	return (reload?: boolean): T => {
		if (reload || typeof instance === 'undefined') {
			instance = getter();
		}
		return instance;
	};
}

/**
 * @desc Create a function that lazily creates an instance of whatever the getter returns asynchronously.
 * @param getterAsync Asynchronous getter function to cache the return value of. Should not return undefined.
 * @returns Resulting getter function for the singleton.
 */
export function createSingletonGetterAsync<T>(getterAsync: () => Promise<T>): (reload?: boolean) => Promise<T> {
	let instance: T;
	return async (reload?: boolean): Promise<T> => {
		if (reload || typeof instance === 'undefined') {
			instance = await getterAsync();
		}
		return instance;
	};
}
