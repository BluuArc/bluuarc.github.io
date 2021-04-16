<script lang="ts">
	import { getProjectDataAsync } from '$lib/stores/projectData';
	import LinkableSection from '../LinkableSection.svelte';
	import LanguageList from '../projects/LanguageList.svelte';

	const overallProjectStatisticsPromise = getProjectDataAsync()
		.then((data) => {
			const overallMessage = `${data.overall.languages.length} languages across ${data.overall.count.total} public repositories (${data.overall.count.mine} owned).`;
			return {
				overallMessage,
				languages: data.overall.languages,
			};
		});
</script>

<LinkableSection title="Overall Project Statistics">
	{#await overallProjectStatisticsPromise}
		Loading project statistics...
	{:then overallStatistics}
		<p>{overallStatistics.overallMessage}</p>
		<section>
			<LanguageList languages={overallStatistics.languages} />
		</section>
	{:catch error}
		<p>An error occurred loading the project statistics.</p>
		<p>{error.message}</p>
	{/await}
	<nav>
		<a href="projects">See more projects</a>
	</nav>
</LinkableSection>
