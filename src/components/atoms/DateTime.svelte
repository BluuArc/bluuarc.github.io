<script lang="ts">
	import { getRelativeTimeString } from '@src/utilities/relative-time-utils';
	export let dateTime: Date = new Date();
	export let includeTimeInTooltip = false;
	export let _windowContext: Window|null = null;
	let isoDateString: string;
	let parsedDateString: string;
	let relativeTimeString: string;
	let ariaId: string;
	let parsedDateStringWidthHelperElement: Element;
	let parsedDateStringWrappingHelperElement: Element;
	let timeElementWidth = 0;
	let parsedDateStringElementWidth = 0;
	let tooltipWrapperStyle: string;
	let enableTooltipWrapping = false;
	let positionTooltipBelow = false;
	let hideTooltipWhileFocused = false;

	$: {
		const parsedDate = new Date(dateTime);
		parsedDateString = parsedDate.toDateString();
		relativeTimeString = getRelativeTimeString(parsedDate);
		if (includeTimeInTooltip) {
			parsedDateString = `${parsedDateString} ${parsedDate.toTimeString()}`;
		}
		isoDateString = parsedDate.toISOString();
		ariaId = `date-desc-${parsedDate.valueOf()}`;
	}

	function getTooltipBoundaries () {
		const windowReference = _windowContext || window;
		// tooltip should not get within 5% of the edges for visbility
		const outerBoundsScale = 0.05;
		const windowWidth = windowReference.innerWidth;
		const windowHeight = windowReference.innerHeight;
		return {
			top: windowHeight * outerBoundsScale,
			left: windowWidth * outerBoundsScale,
			bottom: windowHeight * (1 - outerBoundsScale),
			right: windowWidth * (1 - outerBoundsScale),
		};
	}

	function doesFullTooltipFitInViewport() {
		const boundingRect = parsedDateStringWidthHelperElement.getBoundingClientRect();

		// top offset needed since reference element is displayed in same location as time input
		// when ideal position is above the time element
		const topOffset = (boundingRect.height * 2);
		const projectedToolTipTop = boundingRect.y - topOffset;
		const projectedToolTipBottom = boundingRect.bottom - topOffset;
		const tooltipBounds = getTooltipBoundaries();

		return {
			atPositionHorizontal: boundingRect.x >= tooltipBounds.left && boundingRect.right <= tooltipBounds.right,
			overallHorizontal: boundingRect.width <= tooltipBounds.right, // answers "can it fit without wrapping?"
			extendedRightLength: Math.max(0, boundingRect.right - tooltipBounds.right),
			vertical: projectedToolTipTop > tooltipBounds.top && projectedToolTipBottom < tooltipBounds.bottom,
		};
	}

	function updateTooltipPositioning () {
		if (parsedDateStringWidthHelperElement) {
			const fitInViewportResults = doesFullTooltipFitInViewport();
			const leftOffsetToCenter = Math.max((parsedDateStringElementWidth - timeElementWidth) / 2, 0);

			let horizontalStyles: string;
			if (!fitInViewportResults.atPositionHorizontal) {
				horizontalStyles = 'width: 90vw;';
				if (!fitInViewportResults.overallHorizontal) {
					// enable wrapping and place horizontally center
					enableTooltipWrapping = true;
					horizontalStyles = 'position: fixed; left: 5vw; right: 5vw;';
				} else {
					enableTooltipWrapping = false;
					horizontalStyles = `${horizontalStyles} left: ${-Math.max(fitInViewportResults.extendedRightLength, leftOffsetToCenter)}px;`;
				}
			} else {
				enableTooltipWrapping = false;
				horizontalStyles = `width: ${Math.max(timeElementWidth, parsedDateStringElementWidth)}px;`;
				if (parsedDateStringElementWidth > timeElementWidth) {
					horizontalStyles = `${horizontalStyles} left: ${-leftOffsetToCenter}px;`;
				}
			}

			let verticalStyles = '';
			if (!fitInViewportResults.vertical) {
				positionTooltipBelow = true;
				if (enableTooltipWrapping) {
					const boundingRect = parsedDateStringWidthHelperElement.getBoundingClientRect();
					verticalStyles = `top: ${boundingRect.bottom}px;`;
				}
			} else {
				positionTooltipBelow = false;
				if (enableTooltipWrapping) {
					const boundingRect = parsedDateStringWrappingHelperElement.getBoundingClientRect();
					const { bottom } = getTooltipBoundaries();
					verticalStyles = `top: unset; bottom: calc(${bottom - boundingRect.y}px + 1.5em);`;
				}
			}

			tooltipWrapperStyle = `${horizontalStyles} ${verticalStyles}`;
		}
	}

	function onKeyboardFocus () {
		hideTooltipWhileFocused = false;
		updateTooltipPositioning();
	}

	function onKeyboardBlur () {
		hideTooltipWhileFocused = false;
	}

	function onKeyUp (e: KeyboardEvent) {
		if (e && e.key === 'Escape') {
			hideTooltipWhileFocused = true;
		}
	}
</script>

<div class="container">
	<div
		aria-hidden="true"
		bind:clientWidth={parsedDateStringElementWidth}
		class="tooltip-content"
		bind:this={parsedDateStringWidthHelperElement}
	>{parsedDateString}</div>
	<div
		aria-hidden="true"
		class="tooltip-content enable-wrapping"
		bind:this={parsedDateStringWrappingHelperElement}
	>{parsedDateString}</div>
	<time
		datetime={isoDateString}
		tabindex="0"
		aria-describedby={ariaId}
		bind:clientWidth={timeElementWidth}
		on:focus={onKeyboardFocus}
		on:blur={onKeyboardBlur}
		on:mouseenter={updateTooltipPositioning}
		on:keyup={onKeyUp}
	>
		{relativeTimeString}
	</time>
	<div
		class="tooltip-wrapper"
		role="tooltip"
		id={ariaId}
		style={tooltipWrapperStyle}
		class:display-below={positionTooltipBelow}
		class:hide-while-focused={hideTooltipWhileFocused}
	>
		<span class="tooltip-content" class:enable-wrapping={enableTooltipWrapping}>
			<span class="sr-only">Actual time is</span> {parsedDateString}
		</span>
	</div>
	<slot/>
</div>

<style lang="scss">
	[aria-hidden=true] {
		position: absolute;
		visibility: hidden;
	}

	.tooltip-content {
		// TODO:update to match app styles
		box-sizing: border-box;
		border: 1px solid #fc0;
		padding: 3px 6px;
		background: #fffea1;
		color: black;
		white-space: nowrap;

		&.enable-wrapping {
			white-space: normal;
		}
	}

	.container {
		display: inline-block;
		position: relative;
	}

	time {
		display: inline-block;
		text-decoration: underline dotted;
	}

	[role=tooltip] {
		visibility: hidden;
		position: absolute;
		top: -2em;
		left: 0;

		display: flex;
		justify-content: center;
		z-index: 1;

		&.display-below {
			top: 1.5em;
		}
	}

	[aria-describedby]:hover + [role=tooltip],
	[aria-describedby]:focus + [role=tooltip]:not(.hide-while-focused) {
		visibility: visible;
	}
</style>