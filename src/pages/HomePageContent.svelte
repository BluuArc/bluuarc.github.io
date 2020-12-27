<script>
	import OverallProjectStatisticsSection from "../components/Home/OverallProjectStatisticsSection.svelte";
	import LinkableSection from "../components/LinkableSection.svelte";
import ProjectEntrySection from "../components/Projects/ProjectEntrySection.svelte";
	import RouterLink from "../components/RouterLink.svelte";
	import { getProjectData } from '../stores/projectData';

	const projectDataPromise = getProjectData()
		.then((data) => {
			return Object.values(data.projects)
					.sort((a, b) => new Date(b.lastPushedAt) - new Date(a.lastPushedAt))
					.slice(0, 5);
		});
</script>

<main>
	<h1 class="sr-only">Home</h1>
	<LinkableSection title="About Me">
		<p>I am Joshua Castor and I enjoy programming stuff. My current focus is front-end web development with JavaScript. Looking to learn more about writing performant, accessible, secure sites with good User Experience (UX).</p>
	</LinkableSection>

	<LinkableSection title="Recent Posts">
		<ul>
			<li><RouterLink to="/posts?title=fake-post">A fake post link</RouterLink> - 1 day ago</li>
			<li>TODO</li>
		</ul>
		<nav>
			<RouterLink to="/posts">See more posts</RouterLink>
		</nav>
	</LinkableSection>

	<LinkableSection title="Recent Projects">
		{#await projectDataPromise}
			Loading project data...
		{:then projects}
			<ul>
				{#each projects as project}
					<li>
						<ProjectEntrySection {project} />
					</li>
				{/each}
			</ul>
			<nav>
				<RouterLink to="/posts">See more projects</RouterLink>
			</nav>
		{:catch error}
			<p>An error occurred attempting to get project data.</p>
			<p>{error.message}</p>
		{/await}
	</LinkableSection>

	<OverallProjectStatisticsSection />
</main>
