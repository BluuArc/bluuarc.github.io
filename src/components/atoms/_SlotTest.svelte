<!-- Sourced from https://sveltesociety.dev/recipes/testing-and-debugging/unit-testing-svelte-component/ -->

<script>
	export let componentUnderTest;
</script>

<svelte:component this={componentUnderTest} {...$$restProps}>
	<div data-testid="slot">Test Data</div>
</svelte:component>