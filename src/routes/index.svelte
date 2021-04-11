<script lang="ts">
	import LinkableSection from '$lib/LinkableSection.svelte';
</script>

<svelte:head>
	<title>Home Page | joshuacastor.me</title>
</svelte:head>

<main>
	<h1 class="sr-only">Home Page</h1>

	<LinkableSection title="About Me">
		<p>I am Joshua Castor and I enjoy programming stuff. My current focus is front-end web development with JavaScript. Looking to learn more about writing performant, accessible, secure sites with good User Experience (UX).</p>
	</LinkableSection>

	<LinkableSection title="Recent Posts">
		<ul>
			<li><a href="posts?title=fake-post">A fake post link</a> - 1 day ago</li>
			<li>TODO</li>
		</ul>
		<nav>
			<a href="posts">See more posts</a>
		</nav>
	</LinkableSection>

	<LinkableSection title="Recent Projects">
		TODO
		<!-- {#await projectDataPromise}
			Loading project data...
		{:then projects}
			<ul>
				{#each projects as project}
					<li>
						<ProjectEntrySection {project} />
					</li>
				{/each}
			</ul>
			<nav>
				<RouterLink to="/posts">See more projects</RouterLink>
			</nav>
		{:catch error}
			<p>An error occurred attempting to get project data.</p>
			<p>{error.message}</p>
		{/await} -->
	</LinkableSection>

	<LinkableSection title="Overall Project Statistics">
		TODO
	</LinkableSection>
</main>
