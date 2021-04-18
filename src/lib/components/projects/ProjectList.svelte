<script lang="ts">
	import type { IProjectEntry } from '$lib/stores/projectData';
	import ProjectEntrySection from './ProjectEntrySection.svelte';
	export let projects: IProjectEntry[] = [];
	export let projectHeaderLevel: number = 2;
</script>

{#if projects.length > 0}
<ul>
	{#each projects as project}
		<li>
			<ProjectEntrySection
				{project}
				headerLevel={projectHeaderLevel}
			/>
		</li>
	{/each}
</ul>
{:else}
<span>No project data specified.</span>
{/if}
