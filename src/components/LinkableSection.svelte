<script>
	export let title = 'Section Title';
	let titleId = '';
	$: {
		titleId = title.toLowerCase().replace(/ /, '-');
	}
</script>

<article>
	<header>
		<h2 id={titleId}>{title}</h2>
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
