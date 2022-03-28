
const hostName = 'https://joshuacastor.me/';
export default ({
	dist: './dist/bluuarc.github.io',
	renderers: ['@astrojs/renderer-svelte'],
	buildOptions: {
		site: hostName,
		sitemap: true,
		sitemapFilter: (page) => !page.startsWith(`${hostName}integration/`)
	}
});