import { getLogger } from "$lib/utilities/getLogger";
import { createSingletonGetterAsync } from "$lib/utilities/singletonGetters";

export interface ILanguageEntry {
	name: string;
	color: string;
	size: number;
}

interface IProjectDataJson {
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
	return fetch('./project-data.json')
		.then((r) => r.ok ? r.json() : Promise.reject(r.statusText))
		.then((originalProjectData: { [key: string]: IProjectDataJson }) => {
			logger.debug({ originalProjectData });
			const projects: { [key: string]: IProjectDataJson } = {}; // keyed by "owner/project-name"
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

const projectDataGetter = createSingletonGetterAsync(_getProjectDataAsync);
export function getProjectDataAsync () {
	return projectDataGetter();
}
