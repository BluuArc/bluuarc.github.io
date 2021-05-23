<script context="module" lang="ts">
	import dayjs from 'dayjs';
	import relativeTime from 'dayjs/plugin/relativeTime.js';
	dayjs.extend(relativeTime);
</script>

<script lang="ts">
	import { tick } from 'svelte';

	export let dateTime: string = (new Date()).toDateString();
	let differenceFromNow: string;
	let parsedDateString: string;
	let isoDateString: string;
	let timeElement: HTMLTimeElement;
	let datePopupElement: HTMLDivElement;
	let datePopupIsVisible: boolean = false;
	let datePopupElementWidth: number = 0;
	let datePopupElementHeight: number = 0;
	let timeElementDimensions: { top: number, left: number, width: number, height: number } = { top: 0, left: 0, width: 0, height: 0 };
	let datePopupElementStyle: string = '';

	$: {
		const parsedDate = new Date(dateTime);
		differenceFromNow = dayjs(parsedDate).fromNow();
		parsedDateString = parsedDate.toDateString();
		isoDateString = parsedDate.toISOString();
	}

	$: {
		const leftOffset = (timeElementDimensions.width - datePopupElementWidth) / 2;
		const leftStyle = `${timeElementDimensions.left + leftOffset}px`;
		const topStyle = `${timeElementDimensions.top - datePopupElementHeight - (timeElementDimensions.height * 0.25)}px`;
		datePopupElementStyle = `left: ${leftStyle}; top: ${topStyle}`;
	}

	function showDatePopup () {
		const { top, left, width, height } = timeElement.getBoundingClientRect();
		timeElementDimensions = { top, left, width, height };
		datePopupIsVisible = true;

		tick().then(() => {
			/**
			 * Binding on the element directly doesn't seem work because
			 * client width and client height are 0 when the element
			 * is hidden and doesn't seem to update when the element appears.
			 */
			datePopupElementWidth = datePopupElement.clientWidth;
			datePopupElementHeight = datePopupElement.clientHeight;
		});
	}

	function hideDatePopup () {
		datePopupIsVisible = false;
	}
</script>

<!-- Apply aria-hidden to span since data displayed is already in the span.sr-only within the time element -->
<span
	bind:this={datePopupElement}
	aria-hidden="true"
	class="date-popup-text"
	style={datePopupElementStyle}
	class:visible={datePopupIsVisible}>{parsedDateString}</span>
<time
	bind:this={timeElement}
	datetime={isoDateString}
	tabindex="0"
	on:focus={showDatePopup}
	on:blur={hideDatePopup}
	on:mouseenter={showDatePopup}
	on:mouseleave={hideDatePopup}>{differenceFromNow}<span class="sr-only"> ({parsedDateString})</span></time>

<style lang="scss">
	time {
		text-decoration: underline dotted;
	}

	.date-popup-text {
		display: none;
		position: fixed;

		// TODO:update to match app styles
		border: 1px solid #fc0;
		padding: 3px 6px;
		background: #fffea1;
		&.visible {
			display: block;
		}
	}
</style>

