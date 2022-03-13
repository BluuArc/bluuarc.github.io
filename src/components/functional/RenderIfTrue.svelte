<script>
	/**
	 * Intended to be used as an 'if' statement for conditionally
	 * rendering things within astro pages.
	 */
	export let ifCondition = false;
</script>

{#if !!ifCondition}
<slot/>
{/if}
