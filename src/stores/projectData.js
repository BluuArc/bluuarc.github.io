import { createSingletonGetterAsync } from '../modules/singletonGetter';
import { createLogger } from '../modules/logger';

const projectDataGetter = createSingletonGetterAsync(_getProjectData);
const logger = createLogger('projectData');

function _getProjectData () {
	return fetch('./project-data.json')
		.then((r) => r.ok ? r.json() : Promise.reject(r.statusText))
		.then((originalProjectData) => {
			logger.debug({ originalProjectData })
			const projects = {}; // keyed by "owner/project-name"
			const languageData = {};
			const ownershipData = {};
			const overall = {
				languages: [],
				ownership: [],
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

export function getProjectData () {
	return projectDataGetter();
}

