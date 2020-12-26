const APP_KEY = 'jcmeApp';

export function getAppContextFromWindow () {
	return window[APP_KEY] || (window[APP_KEY] = {});
}

export function getValueFromSessionStorage (key) {
	return window.sessionStorage.getItem(`${APP_KEY}:${key}`);
}

export function setValueOnSessionStorage (key, value) {
	return window.sessionStorage.setItem(`${APP_KEY}:${key}`, value);
}
