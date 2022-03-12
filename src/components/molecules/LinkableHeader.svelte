<script lang="ts">
	import DynamicLeveledHeader from '../atoms/DynamicLeveledHeader.svelte';
	export let title = 'Section Title';
	export let level = 2;
	export let titleId = ''; // intended to be read, not set
	$: {
		titleId = `h${level}-${title.toLowerCase().replace(/ /g, '-')}`;
	}
</script>

<header>
	<div class="header-label">
		<DynamicLeveledHeader {level} id={titleId}>{title}</DynamicLeveledHeader>
		<a href={`#${titleId}`}><span aria-hidden="true">#</span><span class="sr-only">Go to the "{title}" section</span></a>
	</div>
	<!-- Can use slot for extra metadata about the stuff being titled with the header -->
	<slot/>
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
