const WINDOW_KEY = 'jcmeApp';

export function getAppContextFromWindow () {
	return window[WINDOW_KEY] || (window[WINDOW_KEY] = {});
}
