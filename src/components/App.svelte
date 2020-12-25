<script>
	import { onMount } from 'svelte';
	let count = 0;
	onMount(() => {
		const interval = setInterval(() => count++, 1000);
		return () => {
			clearInterval(interval);
		};
	});
</script>

<style>
	.app-logo {
		height: 36vmin;
		pointer-events: none;
		margin-bottom: 3rem;
		animation: app-logo-pulse infinite 1.6s ease-in-out alternate;
	}
	@keyframes app-logo-pulse {
		from {
			transform: scale(1);
		}
		to {
			transform: scale(1.06);
		}
	}
</style>

<div class="app">
	<img src="/logo.svg" class="app-logo" alt="logo" />
	<p>Page has been open for <code>{count}</code> seconds.</p>
	<p>
		Hello from Svelte! This is a new thing!
	</p>
</div>
