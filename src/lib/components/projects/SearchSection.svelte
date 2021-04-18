<script lang="ts">
	import type { IProjectEntry } from '$lib/stores/projectData';
	import CheckboxGroup from '../inputs/CheckboxGroup.svelte';
	import RadioGroup from '../inputs/RadioGroup.svelte';

	export let disabled: boolean = false;
	export let languages: string[] = [];
	export let authors: string[] = [];
	export let allProjects: IProjectEntry[] = [];
	const projectPageOptions = [
		{ label: 'With or Without Project Page', value: 0 },
		{ label: 'Only With Project Page', value: 1 },
		{ label: 'Only Without Project Page', value : 2 },
	];
	const packageOptions = [
		{ label: 'With or Without Packages', value: 0 },
		{ label: 'Only With Packages', value: 1 },
		{ label: 'Only Without Packages', value : 2 },
	];
	const deploymentOptions = [
		{ label: 'With or Without Deployments', value: 0 },
		{ label: 'Only With Deployments', value: 1 },
		{ label: 'Only Without Deployments', value : 2 },
	];
	const sortTypeOptions = [
		{ label: 'Last Commit Date', value: 'lastCommitDate' },
		{ label: 'Alphabetical', value: 'alphabetical' },
		{ label: 'Creation Date', value: 'creationDate' },
		{ label: 'Last Deployment Date', value: 'deploymentDate' },
	];
	const sortDirectionOptions = [
		{ label: 'Ascending', value: 1 },
		{ label: 'Descending', value: -1 },
	];;
	let languageOptions: { label: string, value: string }[] = [];
	let authorOptions: { label: string, value: string }[] = [];
	let selectedLanguages = [];
	let selectedAuthors = [];
	let projectPageExistenceFilter = 0;
	let packageExistenceFilter = 0;
	let deploymentExistenceFilter = 0;
	let sortType = 'lastCommitDate';
	let sortDirection = -1;

	function convertStringArrayToLabelValuePairArray(arr: string[]): { label: string, value: string }[] {
		return arr.map((value) => ({ label: value, value }));
	}

	$: {
		languageOptions = convertStringArrayToLabelValuePairArray(languages);
		authorOptions = convertStringArrayToLabelValuePairArray(authors);
	}

</script>
<section>
	<form>
		<h2>Search Projects</h2>
		<div>
			<label for="name">Name:</label>
			<input type="text" name="name" id="name" {disabled}>
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
