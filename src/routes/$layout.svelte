<script>
	import '../app.scss';
</script>

<header>
	<span class="header-1">JC.ME</span>
	<nav aria-labelledby="main-page-navigation-label">
		<span class="sr-only" id="main-page-navigation-label">Site Navigation</span>
		<ul>
			<li><a href=".">Home</a>
			<li><a href="projects">Projects</a>
			<li><a href="posts">Posts</a>
		</ul>
	</nav>
</header>
<slot />
<footer>
	<section>
		<h2>Contact Information</h2>
		<address>
			<ul>
				<li><a href="mailto:joshua.castor@joshuacastor.me">Email</a></li>
				<li><a href="https://github.com/BluuArc">GitHub</a></li>
				<li><a href="https://www.linkedin.com/in/joshuacastor">LinkedIn</a></li>
				<li><a href="https://www.evl.uic.edu/entry.php?id=2302">Electronic Visualization Laboratory (EVL)</a></li>
			</ul>
		</address>
	</section>
	<section>
		<h2>Technologies Used</h2>
		<ul>
			<li><a href="https://kit.svelte.dev/">SvelteKit</a> - web framework</li>
			<li><a href="https://pages.github.com/">GitHub Pages</a> - hosting</li>
		</ul>
	</section>
	<p>© 2020-2021</p>
</footer>
