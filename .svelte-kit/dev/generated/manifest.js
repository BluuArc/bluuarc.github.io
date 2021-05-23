const c = [
	() => import("..\\..\\..\\src\\routes\\__layout.svelte"),
	() => import("..\\components\\error.svelte"),
	() => import("..\\..\\..\\src\\routes\\index.svelte"),
	() => import("..\\..\\..\\src\\routes\\projects.svelte"),
	() => import("..\\..\\..\\src\\routes\\posts\\__layout.svelte"),
	() => import("..\\..\\..\\src\\routes\\posts\\index.svelte"),
	() => import("..\\..\\..\\src\\routes\\posts\\2017\\01\\my-first-site-v1.svx"),
	() => import("..\\..\\..\\src\\routes\\posts\\2017\\12\\the-spa-treatment-attempt-1.svx")
];

const d = decodeURIComponent;

export const routes = [
	// src/routes/index.svelte
	[/^\/$/, [c[0], c[2]], [c[1]]],

	// src/routes/projects.svelte
	[/^\/projects\/?$/, [c[0], c[3]], [c[1]]],

	// src/routes/posts/index.svelte
	[/^\/posts\/?$/, [c[0], c[4], c[5]], [c[1]]],

	// src/routes/posts/2017/01/my-first-site-v1.svx
	[/^\/posts\/2017\/01\/my-first-site-v1\/?$/, [c[0], c[4], c[6]], [c[1]]],

	// src/routes/posts/2017/12/the-spa-treatment-attempt-1.svx
	[/^\/posts\/2017\/12\/the-spa-treatment-attempt-1\/?$/, [c[0], c[4], c[7]], [c[1]]]
];

export const fallback = [c[0](), c[1]()];