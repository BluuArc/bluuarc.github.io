import type { IProjectEntry } from '../stores/projectData';
export enum TernaryOption {
	TrueOrFalse = 0,
	True = 1,
	False = 2,
};

export enum SortType {
	LastCommitDate = 'lastCommitDate',
	Alphabetical = 'alphabetical',
	CreationDate = 'creationDate',
};

export interface IProjectFilterOptions {
	name: string;
	languages: string[];
	authors: string[];
	projectPageExistenceFilter: TernaryOption;
	packageExistenceFilter: TernaryOption;
	deploymentExistenceFilter: TernaryOption;
	sortType: SortType;
	sortDirection: number;
}

export function getProjectPageExistenceFilterOptions () {
	return [
		{ label: 'With or Without Project Page', value: TernaryOption.TrueOrFalse },
		{ label: 'Only With Project Page', value: TernaryOption.True },
		{ label: 'Only Without Project Page', value: TernaryOption.False },
	];
}

export function getPackageExistenceFilterOptions () {
	return [
		{ label: 'With or Without Packages', value: TernaryOption.TrueOrFalse },
		{ label: 'Only With Packages', value: TernaryOption.True },
		{ label: 'Only Without Packages', value: TernaryOption.False },
	]
}

export function getDeploymentExistenceFilterOptions () {
	return [
		{ label: 'With or Without Deployments', value: TernaryOption.TrueOrFalse },
		{ label: 'Only With Deployments', value: TernaryOption.True },
		{ label: 'Only Without Deployments', value: TernaryOption.False },
	];
}

export function getSortTypeOptions (): { label: string, value: SortType, filterFunction: (a: IProjectEntry, b: IProjectEntry, direction: number) => number }[] {
	return [
		{
			label: 'Last Commit Date',
			value: SortType.LastCommitDate,
			filterFunction: (a, b, direction) =>
				(new Date(a.lastPushedAt).valueOf() - new Date(b.lastPushedAt).valueOf() * direction)
			},
		{
			label: 'Alphabetical',
			value: SortType.Alphabetical,
			filterFunction: (a, b, direction) =>
				(a.name.toLocaleLowerCase().localeCompare(b.name.toLocaleLowerCase()) * direction)
		},
		{
			label: 'Creation Date',
			value: SortType.CreationDate,
			filterFunction: (a, b, direction) =>
				(new Date(a.createdAt).valueOf() - new Date(b.createdAt).valueOf() * direction)
		},
	];
}

export function getSortDirectionOptions () {
	return [
		{ label: 'Ascending', value: 1 },
		{ label: 'Descending', value: -1 },
	];
}

const filterPipeline: ((project: IProjectEntry, filters: IProjectFilterOptions) => boolean)[] = [
	function filterName (project, { name }) {
		let result = !name;
		if (!result) {
			result = project.name.toLowerCase().includes(name);
		}
		return result;
	},
	function filterLanguage (project, { languages }) {
		let result = languages.length === 0;
		if (!result) {
			// project must have at least one of the selected languages
			result = languages.some((language) => project.languages.some((projectLanguage) => projectLanguage.name === language));
		}
		return result;
	},
	function filterAuthor (project, { authors }) {
		let result = authors.length === 0;
		if (!result) {
			result = authors.some((author) => project.owner === author);
		}
		return result;
	},
	function filterProjectPageExistence (project, { projectPageExistenceFilter }) {
		let result = projectPageExistenceFilter === TernaryOption.TrueOrFalse;
		if (!result) {
			const hasHomepageUrl = !!project.homepageURL;
			result = (projectPageExistenceFilter === TernaryOption.True && hasHomepageUrl)
				|| (projectPageExistenceFilter === TernaryOption.False && !hasHomepageUrl);
		}
		return result;
	},
	function filterPackageExistence (project, { packageExistenceFilter }) {
		let result = packageExistenceFilter === TernaryOption.TrueOrFalse;
		if (!result) {
			const hasPackages = project.packages.totalCount > 0;
			result = (packageExistenceFilter === TernaryOption.True && hasPackages)
				|| (packageExistenceFilter === TernaryOption.False && !hasPackages)
		}
		return result;
	},
	function filterDeploymentExistence (project, { deploymentExistenceFilter }) {
		let result = deploymentExistenceFilter === TernaryOption.TrueOrFalse;
		if (!result) {
			const hasDeployments = project.deployments.totalCount > 0;
			result = (deploymentExistenceFilter === TernaryOption.True && hasDeployments)
				|| (deploymentExistenceFilter === TernaryOption.False && !hasDeployments);
		}
		return result;
	},
];

function getSortFunction (sortType: SortType, sortDirection: number): (a: IProjectEntry, b: IProjectEntry) => number {
	const sortTypes = getSortTypeOptions();
	// default to alphabetical
	const matchingSortType = sortTypes.find((t) => t.value === sortType) || sortTypes.find((t) => t.value === SortType.Alphabetical);
	return (a, b) => matchingSortType.filterFunction(a, b, sortDirection);
}

export function getFilteredProjectList (projects: IProjectEntry[], filters: IProjectFilterOptions): IProjectEntry[] {
	const sortFunction = getSortFunction(filters.sortType, filters.sortDirection);
	return projects
		.filter((project) => filterPipeline.every((filterMatcher) => filterMatcher(project, filters)))
		.sort(sortFunction);
}

export function getDefaultFilterOptions (): IProjectFilterOptions {
	return {
		name: '',
		languages: [],
		authors: [],
		projectPageExistenceFilter: TernaryOption.TrueOrFalse,
		packageExistenceFilter: TernaryOption.TrueOrFalse,
		deploymentExistenceFilter: TernaryOption.TrueOrFalse,
		sortType: SortType.LastCommitDate,
		sortDirection: -1,
	};
}

function arraysAreIdentical<T>(a: T[], b: T[], compareFunction = (valueA: T, valueB: T) => valueA === valueB): boolean {
	let result = a.length === b.length;
	if (result) {
		result = a.every((valueA) => b.some((valueB) => compareFunction(valueA, valueB)));
	}
	return result;
}

export function filterOptionsToUrlSearchParams (filters: IProjectFilterOptions): URLSearchParams {
	const params = new URLSearchParams();
	const defaultFilters = getDefaultFilterOptions();
	Object.keys(defaultFilters).forEach((filterKey) => {
		const defaultValue = defaultFilters[filterKey];
		const filterValue = filters[filterKey];
		let differsFromDefault = false;
		if (Array.isArray(defaultValue)) {
			differsFromDefault = (Array.isArray(filterValue) && !arraysAreIdentical(defaultValue, filterValue));
		} else {
			// would need to update if complex objects are added to filter
			differsFromDefault = defaultValue !== filterValue;
		}
		// only add params for params differing from the default for smaller URLs
		if (differsFromDefault) {
			params.set(filterKey, filterValue);
		}
	});
	return params;
}

export function urlSearchParamstoFilterOptions (params: URLSearchParams): IProjectFilterOptions {
	const filterResult = getDefaultFilterOptions();
	params.forEach((value, key) => {
		const defaultValue = filterResult[key];
		if (Array.isArray(defaultValue)) {
			// assumes array of strings
			filterResult[key] = value.split(',');
		} else if (typeof defaultValue === 'number') {
			filterResult[key] = +value;
		} else {
			filterResult[key] = value;
		}
	});
	return filterResult;
}
