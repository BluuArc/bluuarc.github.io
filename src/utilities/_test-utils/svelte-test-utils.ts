import type { RenderResult } from '@testing-library/svelte';

export { render as renderSvelteComponent } from '@testing-library/svelte';

export function getSvelteElementFromRenderResult (result: RenderResult) {
	// default container is document.body, and there is a wrapper div around the Svelete element
	return result.container.children[0].children[0];
}
