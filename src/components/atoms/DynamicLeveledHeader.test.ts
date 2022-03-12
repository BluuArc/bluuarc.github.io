import * as mockLoggerContext from '@src/utilities/_test-utils/setupMockGetLoggerContext'; // placed above to override import in component
import { getSvelteElementFromRenderResult, renderSvelteComponent } from '@src/utilities/_test-utils/svelte-test-utils';
import DynamicLeveledHeader from './DynamicLeveledHeader.svelte';
import SlotTest from './_SlotTest.svelte';


describe('DynamicLeveledHeader', () => {
	const NON_NUMBER_HEADER_LEVEL = 'not-a-number-header-level';
	const ARBITRARY_TITLE = 'arbitrary value for title attribute';

	beforeEach(() => {
		mockLoggerContext.resetLoggerMocks();
	});

	test('renders h2 by default', () => {
		const result = renderSvelteComponent(DynamicLeveledHeader);
		const component = getSvelteElementFromRenderResult(result);
		expect(component.tagName).toBe('H2');
	});

	describe('header levels', () => {
		Array.from({ length: 6 }, (_, i) => i + 1).forEach((validHeaderLevel) => {
			const expectedHeaderTag = `h${validHeaderLevel}`;
			test(`renders [${expectedHeaderTag}] when given level [${validHeaderLevel}]`, () => {
				const result = renderSvelteComponent(
					DynamicLeveledHeader,
					{ props: { level: validHeaderLevel } },
				);
				const component = getSvelteElementFromRenderResult(result);
				expect(component.tagName).toBe(expectedHeaderTag.toUpperCase());
			});

			test(`renders with no children by default when given level [${validHeaderLevel}]`, () => {
				const result = renderSvelteComponent(
					DynamicLeveledHeader,
					{ props: { level: validHeaderLevel } },
				);
				const component = getSvelteElementFromRenderResult(result);
				expect(component.children.length).toBe(0);
			});

			test(`renders slotted content under [${expectedHeaderTag}] when given level [${validHeaderLevel}]`, () => {
				const result = renderSvelteComponent(
					SlotTest,
					{
						props: {
							componentUnderTest: DynamicLeveledHeader,
							level: validHeaderLevel,
						},
					},
				);
				const component = getSvelteElementFromRenderResult(result);
				expect(component.tagName).toBe(expectedHeaderTag.toUpperCase());
				expect(component.children.length).toBe(1); // the slot test component only has one element
				expect(component.querySelector('[data-testid="slot"]')).not.toBeNull();
			});

			test(`passes down attributes to rendered [${expectedHeaderTag}] when given level [${validHeaderLevel}]`, () => {
				const result = renderSvelteComponent(
					DynamicLeveledHeader,
					{
						props: {
							level: validHeaderLevel,
							title: ARBITRARY_TITLE,
						},
					},
				);
				const component = getSvelteElementFromRenderResult(result);
				expect(component.getAttribute('title')).toEqual(ARBITRARY_TITLE);
			});
		});

		describe('header level values above 6', () => {
			const expectDivHeaderAttributes = (div: Element, expectedHeaderLevel: number) => {
				expect(div.tagName).toBe('DIV');
				expect(div.getAttribute('role')).toBe('heading');
				expect(div.getAttribute('aria-level')).toBe(`${expectedHeaderLevel}`);
				expect(div.classList.contains(`header-${expectedHeaderLevel}`)).toBeTruthy();
			};

			[7, 10].forEach((largerHeaderLevel) => {
				test(`renders div with aria-role="heading" and specified level when given level above 6 [${largerHeaderLevel}]`, () => {
					const result = renderSvelteComponent(
						DynamicLeveledHeader,
						{ props: { level: largerHeaderLevel } },
					);
					const component = getSvelteElementFromRenderResult(result);
					expectDivHeaderAttributes(component, largerHeaderLevel);
				});

				test(`renders with no children by default when given level above 6 [${largerHeaderLevel}]`, () => {
					const result = renderSvelteComponent(
						DynamicLeveledHeader,
						{ props: { level: largerHeaderLevel } },
					);
					const component = getSvelteElementFromRenderResult(result);
					expect(component.children.length).toBe(0);
				});

				test(`renders slotted content under div when given level above 6 [${largerHeaderLevel}]`, () => {
					const result = renderSvelteComponent(
						SlotTest,
						{
							props: {
								componentUnderTest: DynamicLeveledHeader,
								level: largerHeaderLevel,
							},
						},
					);
					const component = getSvelteElementFromRenderResult(result);
					expectDivHeaderAttributes(component, largerHeaderLevel);
					expect(component.children.length).toBe(1); // the slot test component only has one element
					expect(component.querySelector('[data-testid="slot"]')).not.toBeNull();
				});

				test(`passes down attributes to rendered div when given level [${largerHeaderLevel}]`, () => {
					const result = renderSvelteComponent(
						DynamicLeveledHeader,
						{
							props: {
								level: largerHeaderLevel,
								title: ARBITRARY_TITLE,
							},
						},
					);
					const component = getSvelteElementFromRenderResult(result);
					expect(component.getAttribute('title')).toEqual(ARBITRARY_TITLE);
				});
			});
		});


		describe('invalid header level values', () => {
			[NON_NUMBER_HEADER_LEVEL, 0].forEach((invalidHeaderLevel) => {
				test(`renders div when given level [${invalidHeaderLevel}]`, () => {
					const result = renderSvelteComponent(
						DynamicLeveledHeader,
						{ props: { level: invalidHeaderLevel } },
					);
					const component = getSvelteElementFromRenderResult(result);
					expect(component.tagName).toBe('DIV');
				});

				test(`renders with no children by default when given level [${invalidHeaderLevel}]`, () => {
					const result = renderSvelteComponent(
						DynamicLeveledHeader,
						{ props: { level: invalidHeaderLevel } },
					);
					const component = getSvelteElementFromRenderResult(result);
					expect(component.children.length).toBe(0);
				});

				test(`renders slotted content under div when given level [${invalidHeaderLevel}]`, () => {
					const result = renderSvelteComponent(
						SlotTest,
						{
							props: {
								componentUnderTest: DynamicLeveledHeader,
								level: invalidHeaderLevel,
							},
						},
					);
					const component = getSvelteElementFromRenderResult(result);
					expect(component.tagName).toBe('DIV');
					expect(component.children.length).toBe(1); // the slot test component only has one element
					expect(component.querySelector('[data-testid="slot"]')).not.toBeNull();
				});

				test(`logs a warning when given level [${invalidHeaderLevel}]`, () => {
					renderSvelteComponent(
						DynamicLeveledHeader,
						{ props: { level: invalidHeaderLevel } },
					);

					const expectedMessage = `header level [${invalidHeaderLevel}] is not a number; rendering div without header role`;
					expect(mockLoggerContext.getMockLogger().warn).toBeCalledWith(expectedMessage);
				});

				test(`passes down attributes to rendered div when given level [${invalidHeaderLevel}]`, () => {
					const result = renderSvelteComponent(
						DynamicLeveledHeader,
						{
							props: {
								level: invalidHeaderLevel,
								title: ARBITRARY_TITLE,
							},
						},
					);
					const component = getSvelteElementFromRenderResult(result);
					expect(component.getAttribute('title')).toEqual(ARBITRARY_TITLE);
				});
			});
		});
	});
});