<script context="module" lang="ts">
	import { defaultLoadMethodForMethodStore } from '$lib/stores/fetchMethod';
	export function load(args) {
		return defaultLoadMethodForMethodStore(args);
	}
</script>

<script lang="ts">
	import OverallProjectStatisticsSection from '$lib/components/home/OverallProjectStatisticsSection.svelte';
	import LinkableSection from '$lib/components/LinkableSection.svelte';
	import ProjectList from '$lib/components/projects/ProjectList.svelte';
	import { getProjectDataAsync } from '$lib/stores/projectData';
	import { getPostDataAsync } from '$lib/stores/postData';
	import PostList from '$lib/components/posts/PostList.svelte';

	const projectDataPromise = getProjectDataAsync()
		.then((data) => {
			// get first 5 projects
			return Object.values(data.projects)
				.sort((a, b) => new Date(b.lastPushedAt).valueOf() - new Date(a.lastPushedAt).valueOf())
				.slice(0, 5);
		});
	const postDataPromise = getPostDataAsync()
		.then((posts) => {
			return posts.slice()
				.sort((a, b) => new Date(b.dateModified || b.datePublished).valueOf() - new Date(a.dateModified || a.datePublished).valueOf())
				.slice(0, 5);
		});
</script>

<svelte:head>
	<title>Home Page | joshuacastor.me</title>
</svelte:head>

<main>
	<h1 class="sr-only">Home Page</h1>

	<LinkableSection title="About Me">
		<p>I am Joshua Castor and I enjoy programming stuff. My current focus is front-end web development with JavaScript. Looking to learn more about writing performant, accessible, secure sites with good User Experience (UX).</p>
	</LinkableSection>

	<!-- TODO: spotlight/showcase excerpt section? -->

	<LinkableSection title="Recent Posts">
		{#await postDataPromise}
			Loading post data...
		{:then posts}
			<PostList {posts}/>
			<nav aria-labelledby="other-post-links-label">
				<h3 class="sr-only" id="other-posts-links-label">Other Post Links</h3>
				<a href="/posts">View more posts.</a>
			</nav>
		{/await}
	</LinkableSection>

	<LinkableSection title="Recent Projects">
		{#await projectDataPromise}
			Loading project data...
		{:then projects}
			<ProjectList {projects}/>
			<nav aria-labelledby="other-project-links-label">
				<h3 class="sr-only" id="other-project-links-label">Other Project Links</h3>
				<a href="/projects">View more projects</a>
			</nav>
		{:catch error}
			<p>An error occurred attempting to get project data.</p>
			<p>{error.message}</p>
		{/await}
	</LinkableSection>

	<OverallProjectStatisticsSection/>
</main>
