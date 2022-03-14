<!-- Based off of @src/components/atoms/_SlotTest.svelte -->

<script>
	export let componentUnderTest;
</script>

<svelte:component this={componentUnderTest} {...$$restProps}>
	<div data-testid="slot">Test Data for if clause</div>
	<div data-testid="slot-else" slot="else">Test Data for else clause</div>
</svelte:component>