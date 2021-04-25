<script lang="ts">
	import type { IPostMetadata } from '$lib/stores/postData';
import DateTime from '../DateTime.svelte';
import DynamicLeveledHeader from '../DynamicLeveledHeader.svelte';

	export let post: IPostMetadata = null;
	export let headerLevel: number = 2;

	let keywords: string[],
		datePublished: Date,
		dateModified: Date;

	$: {
		if (post) {
			if (Array.isArray(post.keywords) && post.keywords.length > 0) {
				keywords = post.keywords.slice();
			}
			datePublished = new Date(post.datePublished);
			if (post.dateModified) {
				dateModified = new Date(post.dateModified);
			}
		}
	}
</script>

<article>
	{#if post}
		<header>
			<a href={post.url}><DynamicLeveledHeader level={headerLevel}>{post.title}</DynamicLeveledHeader></a>
			<p>
				Posted <DateTime dateTime={datePublished.toISOString()} />.
				{#if dateModified}
					Updated <DateTime dateTime={dateModified.toISOString()} />
				{/if}
			</p>
		</header>
		<section>
			<DynamicLeveledHeader level={headerLevel + 1}>Summary</DynamicLeveledHeader>
			<p>{post.description || '(No description provided)'}</p>
		</section>
		{#if keywords}
			<section>
				<DynamicLeveledHeader level={headerLevel + 1}>Keywords</DynamicLeveledHeader>
				<ul>
					{#each keywords as keyword}
						<!-- TODO: add keyword linking -->
						<li>{keyword}</li>
					{/each}
				</ul>
			</section>
		{/if}
	{:else}
		<DynamicLeveledHeader level={headerLevel}>Empty Post Entry</DynamicLeveledHeader>
		<p>No post data found.</p>
	{/if}
</article>
