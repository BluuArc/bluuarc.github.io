<script>
	import ProjectListingSection from "../components/Projects/ProjectListingSection.svelte";
	import SearchSection from "../components/Projects/SearchSection.svelte";
	import { getProjectData } from '../stores/projectData';

	const projectDataPromise = getProjectData()
		.then((data) => {
			return {
				overall: data.overall,
				projects: data.projects,
				projectsAsEntries: Object.values(data.projects)
					.sort((a, b) => new Date(b.lastPushedAt) - new Date(a.lastPushedAt)),
			};
		});
</script>
<main>
	<h1 class="sr-only">Projects</h1>

	{#await projectDataPromise}
		<SearchSection disabled={true}/>
		<section>
			<p>Loading project data...</p>
		</section>
	{:then projectData}
		<SearchSection/>

		<ProjectListingSection projects={projectData.projectsAsEntries}/>
	{:catch error}
		<SearchSection disabled={true}/>
		<section>
			<p>An error occurred loading the project data.</p>
			<p>{error.message}</p>
		</section>
	{/await}

</main>
