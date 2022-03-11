<script lang="ts">
	import LinkableHeader from './LinkableHeader.svelte';
	export let title: string = 'Section Title';
	export let headerLevel: number = 2;
	let titleId: string = '';
</script>

<article>
	<LinkableHeader
		level={headerLevel}
		{title}
		bind:titleId={titleId}
	/>
	<slot headerId={titleId}>Section content</slot>
</article>
