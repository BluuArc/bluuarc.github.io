import '@src/utilities/_test-utils/setupMockGetLoggerContext'; // placed above to override import in component
import { getSvelteElementFromRenderResult, renderSvelteComponent } from '@src/utilities/_test-utils/svelte-test-utils';
import LinkableSection from './LinkableSection.svelte';
import SlotTest from './_LinkableSectionSlotTest.svelte';

describe('LinkableSection', () => {
	const EXPECTED_DEFAULTS = {
		HEADER_TITLE: 'Section Title',
		BASE_ID: 'section-title'
	};

	test('renders topmost element as <article> element', () => {
		const result = renderSvelteComponent(LinkableSection);
		const component = getSvelteElementFromRenderResult(result);
		expect(component.tagName).toBe('ARTICLE');
	});

	test(`renders with single default h2 that has title [${EXPECTED_DEFAULTS.HEADER_TITLE}]`, () => {
		const result = renderSvelteComponent(LinkableSection);
		const headerTitleElement = result.getByText(EXPECTED_DEFAULTS.HEADER_TITLE);
		expect(headerTitleElement.tagName).toBe('H2');
	});

	test('renders with default slotted content of plain text "Section Content', () => {
		const result = renderSvelteComponent(LinkableSection);
		const component = getSvelteElementFromRenderResult(result);

		const [headerElement, defaultSlottedContent] = Array.from(component.children);
		expect(headerElement.tagName).toBe('HEADER');
		expect(defaultSlottedContent.textContent).toBe('Section content');
	});

	test('renders slotted content', () => {
		const result = renderSvelteComponent(
			SlotTest,
			{
				props: {
					componentUnderTest: LinkableSection,
				}
			}
		);
		const component = getSvelteElementFromRenderResult(result);

		const [headerElement, slottedElement] = Array.from(component.children);
		expect(headerElement.tagName).toBe('HEADER');
		expect(component.querySelector('[data-testid="slot"]')).not.toBeNull();
		expect(slottedElement.textContent).toBe(`Test Data h2-${EXPECTED_DEFAULTS.BASE_ID}`);
	});

	[
		void 0,
		{ title: 'My Test Title', expectedBaseId: 'my-test-title' },
		{ title: 'My-Hyphenated-Title', expectedBaseId: 'my-hyphenated-title' },
		{ title: 'MyNoSpaceTitle', expectedBaseId: 'mynospacetitle' },
		{ title: 'My ABC 123 Title', expectedBaseId: 'my-abc-123-title' },
	].forEach((testParams) => {
		const testTitleCase = testParams ? `title [${testParams.title}]` : `default title [${EXPECTED_DEFAULTS.HEADER_TITLE}]`;
		const expectedTitle = testParams ? testParams.title : EXPECTED_DEFAULTS.HEADER_TITLE;
		const expectedBaseId = testParams ? testParams.expectedBaseId : EXPECTED_DEFAULTS.BASE_ID;

		describe(`given ${testTitleCase}`, () => {
			// basic testing for h1, extended testing on LinkableHeader
			test(`renders with single default h1 that has ${testTitleCase} given headerLevel [1]`, () => {
				const result = renderSvelteComponent(LinkableSection, { props: { headerLevel: 1, title: expectedTitle }});
				const headerTitleElement = result.getByText(expectedTitle);
				expect(headerTitleElement.tagName).toBe('H1');
			});

			test('renders slotted content with expected ID given headerLevel [1]', () => {
				const result = renderSvelteComponent(
					SlotTest,
					{
						props: {
							componentUnderTest: LinkableSection,
							headerLevel: 1,
							title: expectedTitle
						}
					}
				);
				const component = getSvelteElementFromRenderResult(result);

				const [headerElement, slottedElement] = Array.from(component.children);
				expect(headerElement.tagName).toBe('HEADER');
				expect(component.querySelector('[data-testid="slot"]')).not.toBeNull();
				expect(slottedElement.textContent).toBe(`Test Data h1-${expectedBaseId}`);
			});
		});
	});
});
