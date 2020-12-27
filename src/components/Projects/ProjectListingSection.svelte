<script>
	import ProjectEntrySection from "./ProjectEntrySection.svelte";

	export let projects = [];
</script>

<section>
	{#if projects.length > 0}
	<ul>
		{#each projects as project}
			<li><ProjectEntrySection {project} /></li>
		{/each}
	</ul>
	{:else}
		No projects found.
	{/if}
</section>
