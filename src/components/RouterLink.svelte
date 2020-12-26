<script>
	import { router } from '../states/router.js';

	export let to = '';

	/**
	 * @param {Event}
	 **/
	function redirectWithRouter(event) {
		if (event && typeof event.preventDefault === 'function') {
			event.preventDefault();
		}
		router.setRouteFromLink(to);
	}
</script>

<a href={to} on:click={redirectWithRouter}>
	<slot></slot>
</a>
