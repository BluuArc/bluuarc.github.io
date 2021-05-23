import { respond } from '@sveltejs/kit/ssr';
import root from './generated/root.svelte';
import { set_paths } from './runtime/paths.js';
import { set_prerendering } from './runtime/env.js';
import * as user_hooks from "./hooks.js";

const template = ({ head, body }) => "<!DOCTYPE html>\n<html lang=\"en\">\n\t<head>\n\t\t<meta charset=\"utf-8\" />\n\t\t<link rel=\"icon\" href=\"/favicon.ico\" />\n\t\t<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\" />\n\t\t" + head + "\n\t</head>\n\t<body>\n\t\t<div id=\"svelte\">" + body + "</div>\n\t</body>\n</html>\n";

let options = null;

// allow paths to be overridden in svelte-kit preview
// and in prerendering
export function init(settings) {
	set_paths(settings.paths);
	set_prerendering(settings.prerendering || false);

	options = {
		amp: false,
		dev: false,
		entry: {
			file: "/./_app/start-ae41be4e.js",
			css: ["/./_app/assets/start-a8cd1609.css"],
			js: ["/./_app/start-ae41be4e.js","/./_app/chunks/vendor-df840aab.js"]
		},
		fetched: undefined,
		floc: false,
		get_component_path: id => "/./_app/" + entry_lookup[id],
		get_stack: error => String(error), // for security
		handle_error: error => {
			console.error(error.stack);
			error.stack = options.get_stack(error);
		},
		hooks: get_hooks(user_hooks),
		hydrate: true,
		initiator: undefined,
		load_component,
		manifest,
		paths: settings.paths,
		read: settings.read,
		root,
		router: true,
		ssr: true,
		target: "#svelte",
		template,
		trailing_slash: "never"
	};
}

const d = decodeURIComponent;
const empty = () => ({});

const manifest = {
	assets: [{"file":"favicon.ico","size":1150,"type":"image/vnd.microsoft.icon"},{"file":"img/avatar-w600.jpg","size":45112,"type":"image/jpeg"},{"file":"img/avatar.jpg","size":1779258,"type":"image/jpeg"},{"file":"img/CAMP.CIRC.SM.WHT.PNG","size":18161,"type":"image/png"},{"file":"img/evl.png","size":10406,"type":"image/png"},{"file":"img/evllogo.png","size":31713,"type":"image/png"},{"file":"img/GitHub-Mark-Light-120px-plus.png","size":4044,"type":"image/png"},{"file":"img/GitHub-Mark-Light-32px.png","size":1571,"type":"image/png"},{"file":"img/ic_email_white_48dp_2x.png","size":553,"type":"image/png"},{"file":"img/In-White-128px-R.png","size":2340,"type":"image/png"},{"file":"img/In-White-34px-R.png","size":1258,"type":"image/png"},{"file":"img/old_sites/v001.PNG","size":44353,"type":"image/png"},{"file":"img/old_sites/v002.PNG","size":354321,"type":"image/png"},{"file":"img/old_sites/v003.PNG","size":404615,"type":"image/png"},{"file":"img/old_sites/v004.PNG","size":252833,"type":"image/png"},{"file":"post-metadata.json","size":891,"type":"application/json"},{"file":"project-data.json","size":33188,"type":"application/json"},{"file":"robots.txt","size":67,"type":"text/plain"}],
	layout: "src/routes/__layout.svelte",
	error: ".svelte-kit/build/components/error.svelte",
	routes: [
		{
						type: 'page',
						pattern: /^\/$/,
						params: empty,
						a: ["src/routes/__layout.svelte", "src/routes/index.svelte"],
						b: [".svelte-kit/build/components/error.svelte"]
					},
		{
						type: 'page',
						pattern: /^\/projects\/?$/,
						params: empty,
						a: ["src/routes/__layout.svelte", "src/routes/projects.svelte"],
						b: [".svelte-kit/build/components/error.svelte"]
					},
		{
						type: 'page',
						pattern: /^\/posts\/?$/,
						params: empty,
						a: ["src/routes/__layout.svelte", "src/routes/posts/__layout.svelte", "src/routes/posts/index.svelte"],
						b: [".svelte-kit/build/components/error.svelte"]
					},
		{
						type: 'page',
						pattern: /^\/posts\/2017\/01\/my-first-site-v1\/?$/,
						params: empty,
						a: ["src/routes/__layout.svelte", "src/routes/posts/__layout.svelte", "src/routes/posts/2017/01/my-first-site-v1.svx"],
						b: [".svelte-kit/build/components/error.svelte"]
					},
		{
						type: 'page',
						pattern: /^\/posts\/2017\/12\/the-spa-treatment-attempt-1\/?$/,
						params: empty,
						a: ["src/routes/__layout.svelte", "src/routes/posts/__layout.svelte", "src/routes/posts/2017/12/the-spa-treatment-attempt-1.svx"],
						b: [".svelte-kit/build/components/error.svelte"]
					}
	]
};

// this looks redundant, but the indirection allows us to access
// named imports without triggering Rollup's missing import detection
const get_hooks = hooks => ({
	getSession: hooks.getSession || (() => ({})),
	handle: hooks.handle || (({ request, render }) => render(request))
});

const module_lookup = {
	"src/routes/__layout.svelte": () => import("..\\..\\src\\routes\\__layout.svelte"),".svelte-kit/build/components/error.svelte": () => import("./components\\error.svelte"),"src/routes/index.svelte": () => import("..\\..\\src\\routes\\index.svelte"),"src/routes/projects.svelte": () => import("..\\..\\src\\routes\\projects.svelte"),"src/routes/posts/__layout.svelte": () => import("..\\..\\src\\routes\\posts\\__layout.svelte"),"src/routes/posts/index.svelte": () => import("..\\..\\src\\routes\\posts\\index.svelte"),"src/routes/posts/2017/01/my-first-site-v1.svx": () => import("..\\..\\src\\routes\\posts\\2017\\01\\my-first-site-v1.svx"),"src/routes/posts/2017/12/the-spa-treatment-attempt-1.svx": () => import("..\\..\\src\\routes\\posts\\2017\\12\\the-spa-treatment-attempt-1.svx")
};

const metadata_lookup = {"src/routes/__layout.svelte":{"entry":"/./_app/pages/__layout.svelte-4334a783.js","css":["/./_app/assets/pages/__layout.svelte-746c1503.css"],"js":["/./_app/pages/__layout.svelte-4334a783.js","/./_app/chunks/vendor-df840aab.js"],"styles":null},".svelte-kit/build/components/error.svelte":{"entry":"/./_app/error.svelte-2d58b62e.js","css":[],"js":["/./_app/error.svelte-2d58b62e.js","/./_app/chunks/vendor-df840aab.js"],"styles":null},"src/routes/index.svelte":{"entry":"/./_app/pages/index.svelte-43aa3a57.js","css":["/./_app/assets/DateTime-42555696.css","/./_app/assets/LinkableHeader-e7a18f30.css"],"js":["/./_app/pages/index.svelte-43aa3a57.js","/./_app/chunks/vendor-df840aab.js","/./_app/chunks/singletonGetters-ff01b479.js","/./_app/chunks/ProjectList-edfcb33f.js","/./_app/chunks/DateTime-99aa3d5e.js","/./_app/chunks/LinkableHeader-1d1bb39d.js","/./_app/chunks/PostList-3dd86d1e.js"],"styles":null},"src/routes/projects.svelte":{"entry":"/./_app/pages/projects.svelte-c9cb26ec.js","css":["/./_app/assets/DateTime-42555696.css"],"js":["/./_app/pages/projects.svelte-c9cb26ec.js","/./_app/chunks/vendor-df840aab.js","/./_app/chunks/singletonGetters-ff01b479.js","/./_app/chunks/ProjectList-edfcb33f.js","/./_app/chunks/DateTime-99aa3d5e.js"],"styles":null},"src/routes/posts/__layout.svelte":{"entry":"/./_app/pages/posts/__layout.svelte-422c5c75.js","css":[],"js":["/./_app/pages/posts/__layout.svelte-422c5c75.js","/./_app/chunks/vendor-df840aab.js"],"styles":null},"src/routes/posts/index.svelte":{"entry":"/./_app/pages/posts/index.svelte-3f127c38.js","css":["/./_app/assets/DateTime-42555696.css"],"js":["/./_app/pages/posts/index.svelte-3f127c38.js","/./_app/chunks/vendor-df840aab.js","/./_app/chunks/singletonGetters-ff01b479.js","/./_app/chunks/PostList-3dd86d1e.js","/./_app/chunks/DateTime-99aa3d5e.js"],"styles":null},"src/routes/posts/2017/01/my-first-site-v1.svx":{"entry":"/./_app/pages/posts/2017/01/my-first-site-v1.svx-8f1ce380.js","css":["/./_app/assets/pages/posts/2017/01/my-first-site-v1.svx-4691ef58.css","/./_app/assets/DateTime-42555696.css","/./_app/assets/LinkableHeader-e7a18f30.css"],"js":["/./_app/pages/posts/2017/01/my-first-site-v1.svx-8f1ce380.js","/./_app/chunks/vendor-df840aab.js","/./_app/chunks/DateTime-99aa3d5e.js","/./_app/chunks/LinkableHeader-1d1bb39d.js","/./_app/chunks/MetadataProcessor-e6515e9d.js"],"styles":null},"src/routes/posts/2017/12/the-spa-treatment-attempt-1.svx":{"entry":"/./_app/pages/posts/2017/12/the-spa-treatment-attempt-1.svx-656da3bb.js","css":["/./_app/assets/pages/posts/2017/01/my-first-site-v1.svx-4691ef58.css","/./_app/assets/DateTime-42555696.css","/./_app/assets/LinkableHeader-e7a18f30.css"],"js":["/./_app/pages/posts/2017/12/the-spa-treatment-attempt-1.svx-656da3bb.js","/./_app/chunks/vendor-df840aab.js","/./_app/chunks/DateTime-99aa3d5e.js","/./_app/chunks/LinkableHeader-1d1bb39d.js","/./_app/chunks/MetadataProcessor-e6515e9d.js"],"styles":null}};

async function load_component(file) {
	return {
		module: await module_lookup[file](),
		...metadata_lookup[file]
	};
}

init({ paths: {"base":"","assets":"/."} });

export function render(request, {
	prerender
} = {}) {
	const host = request.headers["host"];
	return respond({ ...request, host }, options, { prerender });
}