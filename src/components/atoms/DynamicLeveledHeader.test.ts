let mockWarn: jest.MockedFunction<typeof console.warn>;
jest.mock('@src/utilities/getLogger', () => { // placed above to override import in component
	mockWarn = jest.fn().mockName('mockWarn');

	const mockGetLogger = () => ({ warn: mockWarn });
	return { getLogger: mockGetLogger }
});

import { render, RenderResult } from '@testing-library/svelte';
import DynamicLeveledHeader from './DynamicLeveledHeader.svelte';
import SlotTest from './_SlotTest.svelte';


describe('DynamicLeveledHeader', () => {
	const NON_NUMBER_HEADER_LEVEL = 'not-a-number-header-level';
	const ARBITRARY_TITLE = 'arbitrary value for title attribute';

	const getSvelteElementFromRenderResult = (result: RenderResult) => {
		// default container is document.body, and there is a wrapper div around the Svelete element
		return result.container.children[0].children[0];
	};

	beforeEach(() => {
		if (mockWarn) {
			mockWarn.mockClear();
		}
	});

	test('renders h2 by default', () => {
		const result = render(DynamicLeveledHeader);
		const component = getSvelteElementFromRenderResult(result);
		expect(component.tagName).toBe('H2');
	});

	describe('header levels', () => {
		Array.from({ length: 6 }, (_, i) => i + 1).forEach((validHeaderLevel) => {
			const expectedHeaderTag = `h${validHeaderLevel}`;
			test(`renders [${expectedHeaderTag}] when given level [${validHeaderLevel}]`, () => {
				const result = render(
					DynamicLeveledHeader,
					{ props: { level: validHeaderLevel } }
				);
				const component = getSvelteElementFromRenderResult(result);
				expect(component.tagName).toBe(expectedHeaderTag.toUpperCase());
			});

			test(`renders with no children by default when given level [${validHeaderLevel}]`, () => {
				const result = render(
					DynamicLeveledHeader,
					{ props: { level: validHeaderLevel } }
				);
				const component = getSvelteElementFromRenderResult(result);
				expect(component.children.length).toBe(0);
			});

			test(`renders slotted content under [${expectedHeaderTag}] when given level [${validHeaderLevel}]`, () => {
				const result = render(
					SlotTest,
					{
						props: {
							componentUnderTest: DynamicLeveledHeader,
							level: validHeaderLevel
						}
					}
				);
				const component = getSvelteElementFromRenderResult(result);
				expect(component.tagName).toBe(expectedHeaderTag.toUpperCase());
				expect(component.children.length).toBe(1); // the slot test component only has one element
				expect(component.querySelector('[data-testid="slot"]')).not.toBeNull();
			});

			test(`passes down attributes to rendered [${expectedHeaderTag}] when given level [${validHeaderLevel}]`, () => {
				const result = render(
					DynamicLeveledHeader,
					{
							props: {
								level: validHeaderLevel,
								title: ARBITRARY_TITLE
							}
					}
				);
				const component = getSvelteElementFromRenderResult(result);
				expect(component.getAttribute('title')).toEqual(ARBITRARY_TITLE);
			});
		});

		describe('invalid header level values', () => {
			[NON_NUMBER_HEADER_LEVEL, 0, 7].forEach((invalidHeaderLevel) => {
				test(`renders div when given level [${invalidHeaderLevel}]`, () => {
					const result = render(
						DynamicLeveledHeader,
						{ props: { level: invalidHeaderLevel } }
					);
					const component = getSvelteElementFromRenderResult(result);
					expect(component.tagName).toBe('DIV');
				});

				test(`renders with no children by default when given level [${invalidHeaderLevel}]`, () => {
					const result = render(
						DynamicLeveledHeader,
						{ props: { level: invalidHeaderLevel } }
					);
					const component = getSvelteElementFromRenderResult(result);
					expect(component.children.length).toBe(0);
				});
	
				test(`renders slotted content under div when given level [${invalidHeaderLevel}]`, () => {
					const result = render(
						SlotTest,
						{
							props: {
								componentUnderTest: DynamicLeveledHeader,
								level: invalidHeaderLevel
							}
						}
					);
					const component = getSvelteElementFromRenderResult(result);
					expect(component.tagName).toBe('DIV');
					expect(component.children.length).toBe(1); // the slot test component only has one element
					expect(component.querySelector('[data-testid="slot"]')).not.toBeNull();
				});

				test(`logs a warning when given level [${invalidHeaderLevel}]`, () => {
					render(
						DynamicLeveledHeader,
						{ props: { level: invalidHeaderLevel } }
					);

					const expectedMessage = `header level [${invalidHeaderLevel}] is not a number of is not between 1 and 6; rendering div instead`;
					expect(mockWarn).toBeCalledWith(expectedMessage);
				});

				test(`passes down attributes to rendered div when given level [${invalidHeaderLevel}]`, () => {
					const result = render(
						DynamicLeveledHeader,
						{
								props: {
									level: invalidHeaderLevel,
									title: ARBITRARY_TITLE
								}
						}
					);
					const component = getSvelteElementFromRenderResult(result);
					expect(component.getAttribute('title')).toEqual(ARBITRARY_TITLE);
				});
			});
		});
	});
});