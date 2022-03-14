<script lang="ts">
	export let dateTime = (new Date()).toDateString();
	export let includeTimeInTooltip = false;
	let isoDateString: string;
	let parsedDateString: string;
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
		if (includeTimeInTooltip) {
			parsedDateString = `${parsedDateString} ${parsedDate.toTimeString()}`;
		}
		isoDateString = parsedDate.toISOString();
		ariaId = `date-desc-${parsedDate.valueOf()}`;
	}

	function doesFullTooltipFitInViewport() {
		const boundingRect = parsedDateStringWidthHelperElement.getBoundingClientRect();

		// ensure tooltip is within the innermost 90% of the viewport
		const topOffset = (boundingRect.height * 2);
		const projectedToolTipTop = boundingRect.y - topOffset;
		const projectedToolTipBottom = boundingRect.bottom - topOffset;
		const tooltipMaxRight = window.innerWidth * 0.95;
		const tooltipMaxBottom = window.innerHeight * 0.95;

		return {
			atPositionHorizontal: boundingRect.x > 0 && boundingRect.right < tooltipMaxRight,
			overallHorizontal: boundingRect.width <= tooltipMaxRight, // answers "can it fit without wrapping?""
			extendedRightLength: Math.max(0, boundingRect.right - tooltipMaxRight),
			vertical: projectedToolTipTop > 0 && projectedToolTipBottom < tooltipMaxBottom,
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
					verticalStyles = `top: unset; bottom: calc(${window.innerHeight * 0.95 - boundingRect.y}px + 1.5em);`;
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
		TODO: relative time {isoDateString}
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