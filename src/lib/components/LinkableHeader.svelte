<script lang="ts">
	import DynamicLeveledHeader from './DynamicLeveledHeader.svelte';
	export let title: string = 'Section Title';
	export let headerLevel: number = 2;
	export let titleId: string = '';
	$: {
		titleId = `h${headerLevel}-${title.toLowerCase().replace(/ /g, '-')}`;
	}
</script>

<header>
	<div class="header-label">
		<DynamicLeveledHeader level={headerLevel} id={titleId}>{title}</DynamicLeveledHeader>
	<a href={`#${titleId}`} aria-label={`Go to the "${title}" section`}>#</a>
	</div>
	<slot></slot>
</header>

<style lang="scss">
	.header-label {
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
