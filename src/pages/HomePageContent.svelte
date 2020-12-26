<script>
	import RouterLink from "../components/RouterLink.svelte";
</script>

<main>
	<h1 class="sr-only">Home</h1>
	<article>
		<h2 id="about_me">About Me</h2>
		<p>I am Joshua Castor and I enjoy programming stuff. My current focus is front-end web development with JavaScript, but I occasionally dabble into other languages, technologies, and disciplines like C#, visualizations, and cybersecurity.</p>
	</article>

	<article>
		<h2 id="recent_posts">Recent Posts</h2>
		<ul>
			<li><RouterLink to="/posts?title=fake-post">A fake post link</RouterLink> - 1 day ago</li>
			<li>TODO</li>
		</ul>
		<nav>
			<RouterLink to="/posts">See more posts</RouterLink>
		</nav>
	</article>

	<article>
		<h2 id="recent_projects">Recent Projects</h2>
		<ul>
			<li><RouterLink to="/projects?title=fake-post">A fake project link</RouterLink> - 1 day ago</li>
			<li>TODO</li>
		</ul>
		<nav>
			<RouterLink to="/posts">See more projects</RouterLink>
		</nav>
	</article>

	<article>
		<h2 id="project_statistics">Overall Project Statistics</h2>
		<p>TODO</p>
		<nav>
			<RouterLink to="/posts">See more projects</RouterLink>
		</nav>
	</article>
</main>
