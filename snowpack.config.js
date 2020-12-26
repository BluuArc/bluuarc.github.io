const fs = require('fs');
const path = require('path');

/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
	mount: {
		// mapping of project directory names to directory names in prod
		public: '/',
		src: '/dist'
	},
	plugins: [
		/* ... */
		'@snowpack/plugin-svelte',
		[
			'./plugins/snowpack/legacy-bundler.js',
			{
				entrypoints: [
					'dist/pages/index.legacy.js',
					'dist/pages/not-found.legacy.js',
					'dist/pages/posts.legacy.js',
					'dist/pages/projects.legacy.js',
				],
				outputPattern: {
					// overwrite old files with no hashing, as hashing is taken care
					// of in the snowpack-plugin-hash plugin
					js: 'dist/pages/[name].js',
				},
				resolve: {
					alias: {
						'/': path.resolve(__dirname, 'build/'), // ensures chunks are correctly referenced
					}
				}
			}
		],
		// './plugins/snowpack/modified-snowpack-plugin-hash.js',
		// '@snowpack/plugin-webpack',
	],
	install: [
		/* ... */
	],
	installOptions: {
		/* ... */
	},
	devOptions: {
		/* ... */
	},
	buildOptions: {
		/* ... */
	},
	proxy: {
		/* ... */
	},
	alias: {
		/* ... */
	},
	exclude: ["v4/**/*"],
	experiments: {
		optimize: {
			bundle: true,
			minify: true,
			target: 'es2017',
		},
	},
};
