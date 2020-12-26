<script>
	import LinkableSection from "../components/LinkableSection.svelte";
	import RouterLink from "../components/RouterLink.svelte";
</script>

<main>
	<h1 class="sr-only">Home</h1>
	<LinkableSection title="About Me">
		<p>I am Joshua Castor and I enjoy programming stuff. My current focus is front-end web development with JavaScript, but I occasionally dabble into other languages, technologies, and disciplines like C#, visualizations, and cybersecurity.</p>
	</LinkableSection>

	<LinkableSection title="Recent Posts">
		<ul>
			<li><RouterLink to="/posts?title=fake-post">A fake post link</RouterLink> - 1 day ago</li>
			<li>TODO</li>
		</ul>
		<nav>
			<RouterLink to="/posts">See more posts</RouterLink>
		</nav>
	</LinkableSection>

	<LinkableSection title="Recent Projects">
		<ul>
			<li><RouterLink to="/projects?title=fake-post">A fake project link</RouterLink> - 1 day ago</li>
			<li>TODO</li>
		</ul>
		<nav>
			<RouterLink to="/posts">See more projects</RouterLink>
		</nav>
	</LinkableSection>

	<LinkableSection title="Overall Project Statistics">
		<p>TODO</p>
		<nav>
			<RouterLink to="/posts">See more projects</RouterLink>
		</nav>
	</LinkableSection>
</main>
