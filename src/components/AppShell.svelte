<script>
	import AppHeader from './AppHeader.svelte';
	import { router } from '../states/router.js';
	import { createLogger } from '../modules/logger';
	import { onMount, onDestroy } from 'svelte';

	export let startingRoute = '';

	let hasNavigated = false;
	const logger = createLogger('AppShell');
	const unsubscribe = router.subscribe((state) => {
		if (state.rootPath !== startingRoute) {
			logger.log('flipping hasNavigated');
			hasNavigated = true;
		}
	});

	$: if (hasNavigated) {
		unsubscribe();
	}

	onMount(() => {
		router.initializeWindowListeners();
	});

	onDestroy(() => {
		router.destroy();

		if (!hasNavigated) {
			unsubscribe();
		}
	});
</script>


<AppHeader/>
<main>
	{#if !hasNavigated || startingRoute === $router.rootPath}
		<slot>Default route content will appear here.</slot>
	{:else}
		{#await $router.componentPromise}
			Loading route
		{:then routeComponent}
			<svelte:component this={routeComponent.default} />
		{:catch error}
			An error occurred loading the component.

			<p>{error.message}</p>
		{/await}
	{/if}
</main>
