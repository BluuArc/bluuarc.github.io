import { getLogger } from "$lib/utilities/getLogger";
import { createSingletonGetter } from "$lib/utilities/singletonGetters";
import { getCurrentFetchMethod } from "./fetchMethod";

export interface ILanguageEntry {
	name: string;
	color: string;
	size: number;
}

export interface IProjectEntry {
	name: string;
	repoName: string;
	description: string;
	homepageURL: string;
	lastPushedAt: string;
	createdAt: string;
	repoURL: string;
	owner: string;
	deployments: {
		totalCount: number;
		nodes: {
			updatedAt: string;
		}[];
	};
	packages: {
		totalCount: number;
		nodes: {
			name: string;
			packageType: string;
			latestVersion: {
				version: string;
			}
		}[];
	};
	topics: {
		name: string;
		url: string;
	}[];
	languages: ILanguageEntry[];
	// techUsed: [];
}

function _getProjectDataAsync () {
	const logger = getLogger('projectData');
	const fetchMethod = getCurrentFetchMethod() || self.fetch;
	return fetchMethod('/project-data.json')
		.then((r) => r.ok ? r.json() : Promise.reject(r.statusText))
		.then((originalProjectData: { [key: string]: IProjectEntry }) => {
			logger.debug({ originalProjectData });
			const projects: { [key: string]: IProjectEntry } = {}; // keyed by "owner/project-name"
			const languageData: { [lang: string]: ILanguageEntry } = {};
			const ownershipData: { [name: string]: number } = {};
			const overall = {
				languages: [] as ILanguageEntry[],
				ownership: [] as { name: string, count: number }[],
				count: {
					total: 0,
					mine: 0,
				}
			};

			const projectDataAsEntries = Object.entries(originalProjectData);
			overall.count.total = projectDataAsEntries.length;
			projectDataAsEntries.forEach(([key, entry]) => {
				projects[key] = entry;

				if (Array.isArray(entry.languages)) {
					entry.languages.forEach(({ name, color, size }) => {
						if (!languageData[name]) {
							languageData[name] = {
								name,
								color,
								size: 0,
							};
						}
						languageData[name].size += size;
					});

					if (!ownershipData[entry.owner]) {
						ownershipData[entry.owner] = 0;
					}
					ownershipData[entry.owner]++;
				} else {
					logger.warn('no language data found in entry', entry);
				}
			});

			overall.languages = Object.values(languageData)
				.sort((a, b) => b.size - a.size); // sort by largest size

			overall.ownership = Object.entries(ownershipData)
				.sort(([, countA], [, countB]) => countB - countA) // sort by most owned
				.map(([name, count]) => ({ name, count }));
			overall.count.mine = (overall.ownership.find(({ name }) => name === 'BluuArc') || {}).count || 0;

			logger.debug({ projects, overall });
			return {
				projects,
				overall,
			};
		}).catch((error) => {
			logger.error(error);
			throw error;
		});
}

/**
 * Use synchronous getter because the promise gets set sooner than if
 * we were to use an async getter to store the resulting data directly.
 **/
const projectDataGetter = createSingletonGetter(_getProjectDataAsync);
export function getProjectDataAsync () {
	return projectDataGetter();
}
