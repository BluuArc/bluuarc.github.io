<script>
	import AppHeader from './AppHeader.svelte';
	import { router } from '../stores/router.js';
	import { createLogger } from '../modules/logger';
	import { onMount, onDestroy } from 'svelte';
	import AppFooter from './AppFooter.svelte';

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

{#if !hasNavigated || startingRoute === $router.rootPath}
	<slot><main>Default route content will appear here.</main></slot>
	<AppFooter/>
{:else}
	{#await $router.componentPromise}
		<main>Loading route</main>
	{:then routeComponent}
		<svelte:component this={routeComponent.default} />
		<AppFooter/>
	{:catch error}
		<main>
			An error occurred loading the route.
			<p>{error.message}</p>
		</main>
	{/await}
{/if}
