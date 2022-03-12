const sveltePreprocess = require("svelte-preprocess");

// file probably is only needed for IDE linting but keepng it all consistent just in case
module.exports = {
	preprocess: sveltePreprocess({
		// identical to config from https://github.com/withastro/astro/blob/main/packages/renderers/renderer-svelte/index.js#L19
		less: true,
		sass: { renderSync: true },
		scss: { renderSync: true },
		postcss: true,
		stylus: true,
		typescript: true
	}),
};