<script lang="ts">
	import DynamicLeveledHeader from './DynamicLeveledHeader.svelte';
	export let title: string = 'Section Title';
	export let headerLevel: number = 2;
	let titleId: string = '';
	$: {
		titleId = `h${headerLevel}-${title.toLowerCase().replace(/ /g, '-')}`;
	}
</script>

<article>
	<header>
		<DynamicLeveledHeader level={headerLevel} id={titleId}>{title}</DynamicLeveledHeader>
		<a href={`#${titleId}`} aria-label={`Go to ${title}`}>#</a>
	</header>
	<slot>Section content</slot>
</article>

<style lang="scss">
	header {
		display: flex;

		a {
			align-self: center;
			margin-left: 1em;
			color: transparent;
		}

		&:hover a, a:focus {
			color: unset;
		}
	}
</style>
