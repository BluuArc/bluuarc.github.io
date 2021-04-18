<script context="module" lang="ts">
	import { getLogger } from '$lib/utilities/getLogger';
	const logger = getLogger('SearchSection');
</script>

<script lang="ts">
	import type { IProjectEntry } from '$lib/stores/projectData';
	import type { IProjectFilterOptions } from '$lib/utilities/projectFilters'
	import { getDeploymentExistenceFilterOptions, getFilteredProjectList, getPackageExistenceFilterOptions, getProjectPageExistenceFilterOptions, getSortDirectionOptions, getSortTypeOptions, SortType } from '$lib/utilities/projectFilters';
	import CheckboxGroup from '../inputs/CheckboxGroup.svelte';
	import RadioGroup from '../inputs/RadioGroup.svelte';
	import { createEventDispatcher } from 'svelte';

	export let disabled: boolean = false;
	export let languages: string[] = [];
	export let authors: string[] = [];
	export let allProjects: IProjectEntry[] = [];
	const dispatch = createEventDispatcher();
	const projectPageOptions = getProjectPageExistenceFilterOptions();
	const packageOptions = getPackageExistenceFilterOptions();
	const deploymentOptions = getDeploymentExistenceFilterOptions();
	const sortTypeOptions = getSortTypeOptions();
	const sortDirectionOptions = getSortDirectionOptions();
	let nameFilter: string = '';
	let languageOptions: { label: string, value: string }[] = [];
	let authorOptions: { label: string, value: string }[] = [];
	let selectedLanguages = [];
	let selectedAuthors = [];
	let projectPageExistenceFilter = 0;
	let packageExistenceFilter = 0;
	let deploymentExistenceFilter = 0;
	let sortType = SortType.LastCommitDate;
	let sortDirection = -1;

	function convertStringArrayToLabelValuePairArray(arr: string[]): { label: string, value: string }[] {
		return arr.map((value) => ({ label: value, value }));
	}

	$: {
		languageOptions = convertStringArrayToLabelValuePairArray(languages);
		authorOptions = convertStringArrayToLabelValuePairArray(authors);
	}

	function getFilteredProjectsFromInput (): IProjectEntry[] {
		const filterOptions: IProjectFilterOptions = {
			name: nameFilter,
			languages: selectedLanguages,
			authors: selectedAuthors,
			projectPageExistenceFilter,
			packageExistenceFilter,
			deploymentExistenceFilter,
			sortType,
			sortDirection,
		};
		logger.debug(filterOptions);
		return getFilteredProjectList(allProjects, filterOptions);
	}

	function onFormSubmission () {
		const filteredProjects = getFilteredProjectsFromInput();
		logger.debug({ filteredProjects });
		dispatch('filterchange', { filteredProjects });
	}

</script>
<section>
	<form on:submit|preventDefault={onFormSubmission}>
		<h2>Search Projects</h2>
		<div>
			<label for="name">Name:</label>
			<input type="text" name="name" id="name" {disabled} bind:value={nameFilter}>
		</div>
		<section>
			<h3>Additional Filters</h3>
			<CheckboxGroup
				groupTitle="Languages"
				options={languageOptions}
				bind:value={selectedLanguages}
			/>
			<CheckboxGroup
				groupTitle="Authors"
				options={authorOptions}
				bind:value={selectedAuthors}
			/>
			<RadioGroup
				groupTitle="Project Page"
				options={projectPageOptions}
				bind:value={projectPageExistenceFilter}
			/>
			<RadioGroup
				groupTitle="Packages"
				options={packageOptions}
				bind:value={packageExistenceFilter}
			/>
			<RadioGroup
				groupTitle="Deployments"
				options={deploymentOptions}
				bind:value={deploymentExistenceFilter}
			/>
		</section>
		<section>
			<h3>Sorts</h3>
			<RadioGroup
				groupTitle="Type"
				options={sortTypeOptions}
				bind:value={sortType}
			/>
			<RadioGroup
				groupTitle="Direction"
				options={sortDirectionOptions}
				bind:value={sortDirection}
			/>
		</section>

		<button type="submit" {disabled}>Search</button>
	</form>
</section>
