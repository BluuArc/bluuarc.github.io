<script lang="ts">
	import type { IProjectEntry } from '$lib/stores/projectData';
	import ProjectEntrySection from './ProjectEntrySection.svelte';
	export let projects: IProjectEntry[] = [];
</script>

{#if projects.length > 0}
<ul>
	{#each projects as project}
		<li><ProjectEntrySection {project}/></li>
	{/each}
</ul>
{:else}
<span>No project data specified.</span>
{/if}
