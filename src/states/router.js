import { writable } from 'svelte/store';
import { createSingletonGetterAsync } from "../modules/singletonGetter";
import { getAppContextFromWindow } from '../modules/appContextManager.js';

const notFoundRouteInfo = {
	path: '/not-found',
	name: 'Page Not Found',
	getComponent: createSingletonGetterAsync(() => import('../pages/NotFoundPageContent.svelte')),
};

const routes = [
	{
		path: '/',
		name: 'Home',
		getComponent: createSingletonGetterAsync(() => import('../pages/HomePageContent.svelte')),
	},
	{
		path: '/projects',
		name: 'Projects',
		getComponent: createSingletonGetterAsync(() => import('../pages/ProjectsPageContent.svelte')),
	},
	{
		path: '/posts',
		name: 'Posts',
		getComponent: createSingletonGetterAsync(() => import('../pages/PostsPageContent.svelte')),
	},
];

/**
 * @param {string} link
 */
function parseLinkForRouteInformation(link) {
	const linkMetadata = new URL(!link.startsWith('/') ? link : `${location.origin}${link}`);
	const relevantRoute = routes.find((route) => route.path === linkMetadata.pathname);
	if (relevantRoute) {
		return {
			componentPromise: relevantRoute.getComponent(),
			name: relevantRoute.name, // TODO: more flexible naming?
			rootPath: relevantRoute.path,
			path: link,
			params: Array.from(linkMetadata.searchParams.entries()).reduce((acc, [key, value]) => {
				acc[key] = value;
				return acc;
			}, {}),
		};
	}
	return {
		componentPromise: notFoundRouteInfo.getComponent(),
		name: notFoundRouteInfo.name,
		rootPath: notFoundRouteInfo.path,
		path: notFoundRouteInfo.path,
		params: {
			link,
		},
	};
}

function createRouter(initialPath = '/') {
	const initialValue = parseLinkForRouteInformation(initialPath);
	const { subscribe, set, update } = writable(initialValue);

	// don't use a subscribe as we don't want to push a new state
	// when updating route info from a popstate event
	let previousPath = initialValue.path;
	function handlePathChange (state) {
		if (previousPath !== state.path) {
			window.history.pushState(state.path, state.name, state.path);
			previousPath = state.path;
		}
	}

	const popstateFunction = (e) => {
		set(parseLinkForRouteInformation(e.state || window.location.href));
	};

	return {
		subscribe,
		setRouteFromLink: (link) => {
			// TODO: info comparison to only set if different?
			const newRouteInfo = parseLinkForRouteInformation(link);
			set(newRouteInfo);

			handlePathChange(newRouteInfo);
		},
		setRouteParams: (params = {}) => {
			update((state) => {
				state.params = params;
			});
		},
		initializeWindowListeners: () => {
			const windowContext = getAppContextFromWindow();
			if (windowContext.popstateFunction) {
				window.removeEventListener('popstate', windowContext.popstateFunction);
				console.log('removing old popstate');
			}
			windowContext.popstateFunction = popstateFunction;

			console.log('registering popstate');
			window.addEventListener('popstate', popstateFunction);
		},
		destroy: () => {
			window.removeEventListener('popstate', popstateFunction);
			getAppContextFromWindow().popstateFunction = null;
		},
	};
}

export const router = createRouter(window.location.href);
