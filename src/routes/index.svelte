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

	const projectDataPromise = getProjectDataAsync()
		.then((data) => {
			// get first 5 projects
			return Object.values(data.projects)
				.sort((a, b) => new Date(b.lastPushedAt).valueOf() - new Date(a.lastPushedAt).valueOf())
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

	<LinkableSection title="Recent Posts" let:headerId={headerId}>
		<nav aria-labelledby={headerId}>
			<ul>
				<li><a href="posts?title=fake-post">A fake post link</a> - 1 day ago</li>
				<li>TODO</li>
			</ul>
			<a href="posts">See more posts</a>
		</nav>
	</LinkableSection>

	<LinkableSection title="Recent Projects">
		{#await projectDataPromise}
			Loading project data...
		{:then projects}
			<ProjectList {projects}/>
			<nav aria-labelledby="other-project-links-label">
				<h3 class="sr-only" id="other-project-links-label">Other Project Links</h3>
				<a href="projects">See more projects</a>
			</nav>
		{:catch error}
			<p>An error occurred attempting to get project data.</p>
			<p>{error.message}</p>
		{/await}
	</LinkableSection>

	<OverallProjectStatisticsSection/>
</main>
