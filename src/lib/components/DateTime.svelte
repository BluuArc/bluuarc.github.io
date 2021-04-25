<script context="module" lang="ts">
	import dayjs from 'dayjs';
	import relativeTime from 'dayjs/plugin/relativeTime';
	dayjs.extend(relativeTime);
</script>

<script lang="ts">
	export let dateTime: string = (new Date()).toDateString();
	let differenceFromNow: string;
	let parsedDateString: string;
	let isoDateString: string;

	$: {
		const parsedDate = new Date(dateTime);
		differenceFromNow = dayjs(parsedDate).fromNow();
		parsedDateString = parsedDate.toDateString();
		isoDateString = parsedDate.toISOString();
	}
</script>

<time datetime={isoDateString} title={parsedDateString}>{differenceFromNow}<span class="sr-only"> ({parsedDateString})</span></time>

