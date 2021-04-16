<script context="module" lang="ts">
	import { getLogger } from "../utilities/getLogger";
	const logger = getLogger('DynamicLeveledHeader');
</script>

<script lang="ts">
	export let level: number = 2;
	$: {
		if (isNaN(level) || level < 1 || level > 6) {
			logger.warn(`header level [${level}] is not a number of is not between 1 and 6; rendering div instead`);
		}
	}
</script>

{#if level === 1}
<h1 {...$$restProps}><slot></slot></h1>
{:else if level === 2}
<h2 {...$$restProps}><slot></slot></h2>
{:else if level === 3}
<h3 {...$$restProps}><slot></slot></h3>
{:else if level === 4}
<h4 {...$$restProps}><slot></slot></h4>
{:else if level === 5}
<h5 {...$$restProps}><slot></slot></h5>
{:else if level === 6}
<h6 {...$$restProps}><slot></slot></h6>
{:else}
<div {...$$restProps}><slot></slot></div>
{/if}
