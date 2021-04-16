<script lang="ts">
	import type { ILanguageEntry } from '$lib/stores/projectData';
	export let languages: ILanguageEntry[] = [];
	let processedLanguages: { name: string, color: string, percentSize: number }[] = [];
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
	}
</script>

{#if processedLanguages.length > 0}
<ul>
	{#each processedLanguages as language}
		<li>
			{language.name} ({language.percentSize}%)
		</li>
	{/each}
</ul>
{:else}
<span>No language data specified.</span>
{/if}
