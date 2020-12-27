<script>
	export let disabled = false;
</script>
<section>
	<form>
		<h2>Search Projects</h2>
		<div>
			<label for="name">Name:</label>
			<input type="text" name="name" id="name" {disabled}>
		</div>
		<div>
			TODO: languages, author, with/without project page, with/without packages, with/without deployments
		</div>
		<div>
			TODO: sort by last commit date, creation date, deployment date
		</div>

		<button type="submit" {disabled}>Search</button>
	</form>
</section>
