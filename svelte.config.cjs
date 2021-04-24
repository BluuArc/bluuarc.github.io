const sveltePreprocess = require('svelte-preprocess');
const static = require('@sveltejs/adapter-static');
const pkg = require('./package.json');
const { mdsvex } = require('mdsvex');

/** @type {import('@sveltejs/kit').Config} */
module.exports = {
	extensions: ['.svelte', '.svx'],
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: [
		mdsvex(),
		sveltePreprocess(),
	],
	kit: {
		adapter: static(),

		// hydrate the <div id="svelte"> element in src/app.html
		target: '#svelte',

		vite: {
			ssr: {
				noExternal: Object.keys(pkg.dependencies || {})
			}
		}
	}
};
