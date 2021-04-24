import { createSingletonGetter } from "$lib/utilities/singletonGetters";
import { getCurrentFetchMethod } from "./fetchMethod";

export interface ISiteMetadata {
	title: string;
	description: string;
	author: string;
	keywords?: string[];
	image?: string;
	datePublished: Date;
	dateModified?: Date;
	url?: string;
}

function _getPostDataAsync () {
	const fetchMethod = getCurrentFetchMethod() || self.fetch;
	return fetchMethod('/post-metadata.json')
		.then((r) => r.ok ? r.json() as ISiteMetadata[] : Promise.reject(r.statusText));
}

const postDataGetter = createSingletonGetter(_getPostDataAsync);
export function getPostDataAsync () {
	return postDataGetter();
}
