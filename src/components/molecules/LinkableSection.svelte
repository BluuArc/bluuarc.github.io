<script lang="ts">
	import LinkableHeader from './LinkableHeader.svelte';
	export let title = 'Section Title';
	export let headerLevel = 2;
	let titleId = '';
</script>

<article>
	<LinkableHeader
		level={headerLevel}
		{title}
		bind:titleId={titleId}
	/>
	<slot headerId={titleId}><p>Section content</p></slot>
</article>
