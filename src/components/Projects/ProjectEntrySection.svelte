<script>
import LanguagesSection from "./LanguagesSection.svelte";

	export let project = null;
	let deploymentInfo, packageInfo, createdAtDate, lastPushedAtDate, ownerLink;
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
		} else {
			deploymentInfo = packageInfo = { totalCount: 0 };
		}
	}
</script>

<article>
	{#if project}
		<header>
			<h2>{project.name}</h2>
			<p>
				Created <time datetime={createdAtDate.toISOString()}>{createdAtDate.toLocaleDateString()}</time> by <a href={ownerLink}>{project.owner}</a>,
				last committed to on <time datetime={lastPushedAtDate.toISOString()}>{lastPushedAtDate.toLocaleDateString()}</time>
			</p>
		</header>
		<section>
			<h3>Description</h3>
			<p>{project.description || '(No description provided)'}</p>
		</section>
		{#if deploymentInfo.totalCount > 0 || packageInfo.totalCount > 0}
		<section>
			<h3>Release Statistics</h3>
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
		{#if project.topics.length > 0}
			<section>
				<h3>Topics</h3>
				<ul>
					{#each project.topics as topic}
						<li><a href={topic.url}>{topic.name}</a></li>
					{/each}
				</ul>
			</section>
		{/if}
		{/if}
		{#if project.languages.length > 0}
			<LanguagesSection languages={project.languages}/>
		{/if}
		<section>
			<h3>Related Links</h3>
			<nav>
				<ul>
					<li><a href={project.repoURL}>Go to Code Repository</a></li>
					{#if project.homepageURL}
					<li><a href={project.homepageURL}>View Project Page</a></li>
					{/if}
				</ul>
			</nav>
		</section>
	{:else}
		No project data found.
	{/if}
</article>
