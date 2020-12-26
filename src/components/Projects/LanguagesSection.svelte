<script>
	export let languages = [];

	let processedLanguages = [];

	$: {
		const maxSize = languages.reduce((acc, val) => acc + val.size, 0);
		processedLanguages = languages
			.map(({ size, name, color }) => {
				const percentSize = +(((size / maxSize) * 100).toFixed(2));
				return {
					name,
					color,
					percentSize,
				};
			});
	};

</script>

<section>
	<ul>
		{#each processedLanguages as language}
			<li>
				{language.name} ({language.percentSize}%)
			</li>
		{/each}
	</ul>
</section>
