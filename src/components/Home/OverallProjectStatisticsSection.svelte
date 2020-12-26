<script>
	import LinkableSection from "../LinkableSection.svelte";
	import RouterLink from "../RouterLink.svelte";
	import LanguagesSection from "../Projects/LanguagesSection.svelte";
	import { getProjectData } from '../../stores/projectData';

	const overallStatisticsPromise = getProjectData()
		.then((data) => {
			const overallMessage = `${data.overall.languages.length} languages across ${data.overall.count.total} public repositories (${data.overall.count.mine} owned).`;
			return {
				overallMessage,
				languages: data.overall.languages,
			};
		});

</script>

<LinkableSection title="Overall Project Statistics">
	{#await overallStatisticsPromise}
		Loading project statistics...
	{:then overallStatistics}
		<p>
			{overallStatistics.overallMessage}
		</p>
		<LanguagesSection languages={overallStatistics.languages} />
	{:catch error}
		<p>An error occurred loading the project statistics.</p>
		<p>{error.message}</p>
	{/await}
	<nav>
		<RouterLink to="/posts">See more projects</RouterLink>
	</nav>
</LinkableSection>
