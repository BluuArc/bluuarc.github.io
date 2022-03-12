<!-- Based off of @src/components/atoms/_SlotTest.svelte -->

<script>
	export let componentUnderTest;
</script>

<svelte:component this={componentUnderTest} let:headerId={headerId} {...$$restProps}>
	<div data-testid="slot">Test Data {headerId}</div>
</svelte:component>