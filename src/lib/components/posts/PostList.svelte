<script lang="ts">
	import type { IPostMetadata } from "$lib/stores/postData";
import PostEntrySection from "./PostEntrySection.svelte";

	export let posts: IPostMetadata[] = [];
	export let postHeaderLevel: number = 2;
</script>

{#if posts.length > 0}
<ul>
	{#each posts as post}
		<li>
			<PostEntrySection
				{post}
				headerLevel={postHeaderLevel}
			/>
		</li>
	{/each}
</ul>
{:else}
<span>No project data specified.</span>
{/if}
