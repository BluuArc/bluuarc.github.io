<script context="module" lang="ts">
	import { getLogger } from '@src/utilities/getLogger';
	const logger = getLogger('DynamicLeveledHeader');
</script>

<script lang="ts">
	export let level = 2;
	let isValidNumber = true;
	$: {
		isValidNumber = !(isNaN(level) || level < 1);
		if (!isValidNumber) {
			logger.warn(`header level [${level}] is not a number; rendering div without header role`);
		}
	}
</script>

{#if level === 1}
<h1 {...$$restProps}><slot/></h1>
{:else if level === 2}
<h2 {...$$restProps}><slot/></h2>
{:else if level === 3}
<h3 {...$$restProps}><slot/></h3>
{:else if level === 4}
<h4 {...$$restProps}><slot/></h4>
{:else if level === 5}
<h5 {...$$restProps}><slot/></h5>
{:else if level === 6}
<h6 {...$$restProps}><slot/></h6>
{:else if isValidNumber}
<div role="heading" aria-level="{level}" class="header-{level}"  {...$$restProps}><slot/></div>
{:else}
<div {...$$restProps}><slot/></div>
{/if}
