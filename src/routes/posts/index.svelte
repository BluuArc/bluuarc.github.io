<script context="module" lang="ts">
	import { defaultLoadMethodForMethodStore } from '$lib/stores/fetchMethod';
	export function load(args) {
		return defaultLoadMethodForMethodStore(args);
	}
</script>

<script lang="ts">
	import { getPostDataAsync } from '$lib/stores/postData';

	const postDataPromise = getPostDataAsync();
</script>

<svelte:head>
	<title>Blog Posts | joshuacastor.me</title>
</svelte:head>

<main>
	<h1 class="sr-only">Blog Posts</h1>
	{#await postDataPromise}
		<section>
			<p>Loading post data...</p>
		</section>
	{:then postData}
		<ul>
			{#each postData as post}
				<li><a href={post.url}>{JSON.stringify(post)}</a></li>
			{/each}
		</ul>
	{:catch error}
		<section>
			<p>An error occurred loading the post data.</p>
			<p>{error.message}</p>
		</section>
	{/await}
</main>
