import type { Load } from '@sveltejs/kit';
import { writable } from 'svelte/store';

type FetchMethod = (info: RequestInfo, init?: RequestInit) => Promise<any>;

/**
 * @desc Using a store for the fetch method is necessary because for some
 * reason `fetch` from the browser has issues running within SvelteKit
 * due to the app running within a Node context and not a browser context.
 * The intent here is to get a reference to the fetch method used in the `load`
 * method of pages and use it elsewhere within the app once pages start loading.
 * Trying to use any fetch polyfill was met with poor results as Node-versions of
 * fetch did not support relative URLs.
 */
export const fetchMethodStore = writable<FetchMethod>(() => Promise.resolve({ ok: false }));

let fetchMethod: FetchMethod;
fetchMethodStore.subscribe((newFetchMethod) => {
	fetchMethod = newFetchMethod;
});
export function getCurrentFetchMethod () {
	return fetchMethod;
}

/**
 * @desc Barebones function whose sole purpose is to get a reference to the `fetch` method
 * provided in the arguments.
 * @returns Empty object since we don't need any of the data.
 */
export const defaultLoadMethodForMethodStore: Load = ({ fetch }) => {
	fetchMethodStore.set(fetch);
	return {};
}

