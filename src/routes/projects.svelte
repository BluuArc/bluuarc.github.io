<script context="module" lang="ts">
	import { defaultLoadMethodForMethodStore } from '$lib/stores/fetchMethod';
	export function load(args) {
		return defaultLoadMethodForMethodStore(args);
	}
</script>

<script lang="ts">
	import ProjectList from '$lib/components/projects/ProjectList.svelte';
	import SearchSection from '$lib/components/projects/SearchSection.svelte';
	import type { IProjectEntry } from '$lib/stores/projectData';
	import { getProjectDataAsync } from '$lib/stores/projectData';
	import { getLogger } from '$lib/utilities/getLogger';
	import { filterOptionsToUrlSearchParams } from '$lib/utilities/projectFilters';
	import type { IProjectFilterOptions } from '$lib/utilities/projectFilters';

	let visibleProjects: IProjectEntry[] = [];
	let isLoading = true;
	const logger = getLogger('ProjectsPage');
	const projectDataPromise = getProjectDataAsync()
		.then((data) => {
			visibleProjects = Object.values(data.projects);
			isLoading = false;
			const searchingMetadata = {
				languages: data.overall.languages.map((entry) => entry.name),
				authors: data.overall.ownership.map((entry) => entry.name),
				allProjects: Object.values(data.projects),
			};
			return searchingMetadata;
		}).catch((err) => {
			logger.error(err);
			isLoading = false;
			return {
				languages: [],
				authors: [],
				allProjects: [],
			};
		});

	function getParamsForCurrentUrl () {
		return new URLSearchParams(location.href.slice(location.href.indexOf('?') + 1));
	}

	function handleFilterChange (event: { detail: { filteredProjects: IProjectEntry[], filters?: IProjectFilterOptions } }): void {
		if (event && event.detail && Array.isArray(event.detail.filteredProjects)) {
			visibleProjects = event.detail.filteredProjects.slice();
		} else {
			logger.warn('no filtered projects found in filterchange event', event);
		}

		if (event && event.detail && event.detail.filters) {
			const urlParams = filterOptionsToUrlSearchParams(event.detail.filters);
			const urlParamsString = urlParams.toString();
			const currentUrlParamsString = getParamsForCurrentUrl().toString();
			if (urlParamsString !== currentUrlParamsString) {
				const url = `projects?${urlParamsString}`;
				logger.debug('filter navigation url', { url, currentUrlParamsString });
				history.pushState({ url }, document.title, url);
			} else {
				logger.debug('skipping push state due to params being identical', { urlParamsString, currentUrlParamsString });
			}
		}
	}
</script>

<svelte:head>
	<title>Projects Page | joshuacastor.me</title>
</svelte:head>

<main>
	<h1 class="sr-only">Projects Page</h1>

	{#await projectDataPromise}
		<section>
			<p>Loading project data...</p>
		</section>
	{:then searchingMetadata}
		<SearchSection
			disabled={isLoading}
			authors={searchingMetadata.authors}
			languages={searchingMetadata.languages}
			allProjects={searchingMetadata.allProjects}
			on:filterchange={handleFilterChange}
		/>
		<section>
			<h2>Project List</h2>
			<ProjectList
				projects={visibleProjects}
				projectHeaderLevel={3}
			/>
		</section>
	{:catch error}
		<section>
			<p>An error occurred loading the project data.</p>
			<p>{error.message}</p>
		</section>
	{/await}
</main>
