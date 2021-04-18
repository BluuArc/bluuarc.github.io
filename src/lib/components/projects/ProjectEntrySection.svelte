<script lang="ts">
	import type { IProjectEntry } from '$lib/stores/projectData';
	import { getRandomHtmlId } from '$lib/utilities/randomGenerators';
	import DynamicLeveledHeader from '../DynamicLeveledHeader.svelte';
	import LanguageList from './LanguageList.svelte';

	export let project: IProjectEntry = null;
	export let headerLevel: number = 2;
	let deploymentInfo: { totalCount: number, lastDeployment?: Date },
		packageInfo: { totalCount: number, latestPackage?: string },
		createdAtDate: Date,
		lastPushedAtDate: Date,
		ownerLink: string;
	let externalLinksId: string = '';
	$: {
		if (project) {
			const { deployments, packages, createdAt, lastPushedAt } = project;
			deploymentInfo = {
				totalCount: deployments.totalCount,
				lastDeployment: deployments.nodes[0] ? new Date(deployments.nodes[0].updatedAt) : null,
			};
			packageInfo = {
				totalCount: packages.totalCount,
			};
			if (packages.nodes[0]) {
				const entry = packages.nodes[0];
				packageInfo.latestPackage = `${entry.name}@${entry.latestVersion.version}`;
			}
			createdAtDate = new Date(createdAt);
			lastPushedAtDate = new Date(lastPushedAt);
			ownerLink = `https://github.com/${project.owner}/`;
			externalLinksId = getRandomHtmlId();
		} else {
			deploymentInfo = packageInfo = { totalCount: 0 };
		}
	}
</script>

<article>
	{#if project}
		<header>
			<DynamicLeveledHeader level={headerLevel}>{project.name}</DynamicLeveledHeader>
			<p>
				Created <time datetime={createdAtDate.toISOString()}>{createdAtDate.toLocaleDateString()}</time> by <a href={ownerLink}>{project.owner}</a>,
				last committed to on <time datetime={lastPushedAtDate.toISOString()}>{lastPushedAtDate.toLocaleDateString()}</time>
			</p>
		</header>
		<section>
			<DynamicLeveledHeader level={headerLevel + 1}>Description</DynamicLeveledHeader>
			<p>{project.description || '(No description provided)'}</p>
		</section>
		{#if deploymentInfo.totalCount > 0 || packageInfo.totalCount > 0}
			<section>
				<DynamicLeveledHeader level={headerLevel + 1}>Release Statistics</DynamicLeveledHeader>
				<ul>
					{#if deploymentInfo.totalCount > 0}
					<li>
						{deploymentInfo.totalCount} {deploymentInfo.totalCount !== 1 ? 'deployments' : 'deployment'}. Most recent deployment is <time datetime={deploymentInfo.lastDeployment.toISOString()}>{deploymentInfo.lastDeployment.toLocaleDateString()}.</time>
					</li>
					{/if}

					{#if packageInfo.totalCount > 0}
						<li>
							{packageInfo.totalCount} {packageInfo.totalCount !== 1 ? 'packages' : 'package'}. Newest release is {packageInfo.latestPackage}.
						</li>
					{/if}
				</ul>
			</section>
		{/if}
		{#if project.topics.length > 0}
			<section>
				<DynamicLeveledHeader level={headerLevel + 1}>Topics</DynamicLeveledHeader>
				<ul>
					{#each project.topics as topic}
						<li><a href={topic.url}><span class="sr-only">View other GitHub projects under the </span>{topic.name}<span class="sr-only"> topic</span></a></li>
					{/each}
				</ul>
			</section>
		{/if}
		{#if project.languages.length > 0}
			<section>
				<DynamicLeveledHeader level={headerLevel + 1}>Languages</DynamicLeveledHeader>
				<LanguageList languages={project.languages}/>
			</section>
		{/if}
		<section>
			<nav aria-labelledby={externalLinksId}>
				<DynamicLeveledHeader level={headerLevel + 1} id={externalLinksId}>Related External Links <span class="sr-only">for the "{project.name}" project by {project.owner}</span></DynamicLeveledHeader>
				<ul>
					<li><a href={project.repoURL}>Go to Code Repository <span class="sr-only">for the "{project.name}" project by {project.owner}</span></a></li>
					{#if project.homepageURL}
					<li><a href={project.homepageURL}>Visit Project Page <span class="sr-only">for the "{project.name}" project by {project.owner}</span></a></li>
					{/if}
				</ul>
			</nav>
		</section>
	{:else}
		<DynamicLeveledHeader level={headerLevel}>Empty Project Entry</DynamicLeveledHeader>
		<p>No project data found.</p>
	{/if}
</article>
