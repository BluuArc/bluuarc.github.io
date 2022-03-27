import { getSvelteElementFromRenderResult, renderSvelteComponent } from '@src/utilities/_test-utils/svelte-test-utils';
import { act } from '@testing-library/svelte';
import DateTime from './DateTime.svelte';

describe('DateTime', () => {
	const ARBITRARY_TIME_INPUT = new Date('Jan 23 1945 12:34:56');
	const expectedRelativeDifferenceString = `${(new Date()).getFullYear() - ARBITRARY_TIME_INPUT.getFullYear()} years ago`;
	const expectedIsoDateString = ARBITRARY_TIME_INPUT.toISOString();

	const getTimeElementFromComponent = (component: Element) => component.querySelector('time');
	const getTooltipElementFromComponent = (component: Element) => component.querySelector('[role="tooltip"]')

	describe('by default', () => {
		let component: Element;
		beforeEach(() => {
			const result = renderSvelteComponent(DateTime);
			component = getSvelteElementFromRenderResult(result);
		});

		test('renders with single <time> element representing today', () => {
			const timeElements = Array.from(component.querySelectorAll('time'));
			expect(timeElements.length).toEqual(1);

			const timeElement = timeElements[0];
			expect(timeElement.textContent).toBe('today');
		});

		test('renders with single tooltip containing the current time as a full string', () => {
			const tooltipElements = Array.from(component.querySelectorAll('[role="tooltip"]'));
			expect(tooltipElements.length).toEqual(1)

			const currentDate = (new Date()).toDateString();
			const tooltip = tooltipElements[0];
			expect(tooltip.textContent).toBe(`Actual time is ${currentDate}`);
		});
	});

	describe('<time> element contents and attributes', () => {
		let component: Element;
		let timeElement: HTMLTimeElement;
		beforeEach(() => {
			const result = renderSvelteComponent(DateTime, { props: { dateTime: ARBITRARY_TIME_INPUT }});
			component = getSvelteElementFromRenderResult(result);
			timeElement = getTimeElementFromComponent(component);
		});

		test('contains string with time relative to current time', () => {
			expect(timeElement.textContent).toBe(expectedRelativeDifferenceString);
		});

		test('contains a datetime attribute with ISO representation of input time', () => {
			expect(timeElement.dateTime).toBe(expectedIsoDateString);
		});

		test('is indicated to be tabbable via keyboard', () => {
			expect(timeElement.tabIndex).toBe(0);
		});

		test('contains an aria-describedby attribute that is tied to the tooltip element', () => {
			const idInAriaDescribedBy = timeElement.getAttribute('aria-describedby');
			const matchingElement = component.querySelector(`#${idInAriaDescribedBy}`);
			const tooltipElement = component.querySelector('[role="tooltip"]');
			expect(matchingElement).toBe(tooltipElement);
		});
	});

	describe('tooltip element contents', () => {
		const arbitraryInputAsDateString = ARBITRARY_TIME_INPUT.toDateString();

		test('contains string with the input time as a date string by default', () => {
			const result = renderSvelteComponent(DateTime, { props: { dateTime: ARBITRARY_TIME_INPUT }});
			const component = getSvelteElementFromRenderResult(result);
			const tooltipElement = getTooltipElementFromComponent(component);

			expect(tooltipElement.textContent).toBe(`Actual time is ${arbitraryInputAsDateString}`);
		});

		test('contains string with input time as a date string with the given time when [includeTimeInTooltip] is true', () => {
			const result = renderSvelteComponent(DateTime, { props: { dateTime: ARBITRARY_TIME_INPUT, includeTimeInTooltip: true }});
			const component = getSvelteElementFromRenderResult(result);
			const tooltipElement = getTooltipElementFromComponent(component);

			expect(tooltipElement.textContent).toBe(`Actual time is ${arbitraryInputAsDateString} ${ARBITRARY_TIME_INPUT.toTimeString()}`);
		});
	});

	// TODO: convert visibility and positioning behavior to integration tests due to dependency on browser focus and mouse hover
	describe('tooltip visibility behavior', () => {
		let timeElement: HTMLTimeElement;
		let tooltipElement: Element;
		beforeEach(() => {
			const result = renderSvelteComponent(DateTime, { props: { dateTime: ARBITRARY_TIME_INPUT }});
			const component = getSvelteElementFromRenderResult(result);
			timeElement = getTimeElementFromComponent(component);
			tooltipElement = getTooltipElementFromComponent(component);
		});

		const expectTimeInputVisibility = (isVisible = false) => {
			const boundingRect = tooltipElement.getBoundingClientRect();
			if (isVisible) {
				expect(boundingRect.width).toBeGreaterThan(0);
				expect(boundingRect.height).toBeGreaterThan(0);
			} else {
				expect(boundingRect).toEqual(expect.objectContaining({ width: 0, height: 0 }));
			}
		};

		test('tooltip is hidden by default', () => {
			expectTimeInputVisibility(false);
		});

		test.skip('tooltip is visible when the time input is focused', async () => {
			expectTimeInputVisibility(false);
			await act(() => { timeElement.focus(); });
			await new Promise((resolve) => requestAnimationFrame(resolve));
			expectTimeInputVisibility(true);
		});
	});
});
