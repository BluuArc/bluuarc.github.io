import '@src/utilities/_test-utils/setupMockGetLoggerContext'; // placed above to override import in component
import { getSvelteElementFromRenderResult, renderSvelteComponent } from '@src/utilities/_test-utils/svelte-test-utils';
import LinkableHeader from './LinkableHeader.svelte';
import SlotTest from '../atoms/_SlotTest.svelte';

describe('LinkableHeader', () => {
	const EXPECTED_DEFAULTS = {
		HEADER_TITLE: 'Section Title',
		BASE_ID: 'section-title'
	};

	/**
	 * @description Get the header title element and assert that there's only one instance of it.
	 * @param component LinkableHeader as HTML Element
	 * @param expectedHeaderTag Tag of element representing header title
	 * @returns Element representing the header title
	 */
	const getExpectedHeaderTitleElement = (component: Element, expectedHeaderTag: string) => {
		const collection = Array.from(component.querySelectorAll(`.header-label > ${expectedHeaderTag}`));
		expect(collection.length).toBe(1);

		return collection[0];
	};

	/**
	 * @description Get the anchor element in the header and assert that there's only one instance of it.
	 * Also assert visible text, aria-hidden, and sr-only class in the resulting anchor's contents.
	 * @param component LinkableHeader as HTML Element
	 * @returns Element representing the anchor element.
	 */
	const getExpectedAnchorElementForHeader = (component: Element) => {
		const collection = Array.from(component.querySelectorAll('.header-label > a'));
		expect(collection.length).toBe(1);

		const anchor = collection[0];
		const [visibleHash, invisibleText] = Array.from(anchor.children);
		expect(visibleHash.textContent).toBe('#')
		expect(visibleHash.getAttribute('aria-hidden')).toBe('true')
		expect(invisibleText.classList.contains('sr-only')).toBeTruthy();

		return anchor;
	};

	test('renders topmost element as <header> element', () => {
		const result = renderSvelteComponent(LinkableHeader);
		const component = getSvelteElementFromRenderResult(result);
		expect(component.tagName).toBe('HEADER');
	});

	describe('using default values', () => {
		test('renders with single default h2 that has title [Section Title] and ID [h2-section-title]', () => {
			const result = renderSvelteComponent(LinkableHeader);
			const component = getSvelteElementFromRenderResult(result);
			const h2 = getExpectedHeaderTitleElement(component, 'h2');
			expect(h2.id).toBe(`h2-${EXPECTED_DEFAULTS.BASE_ID}`);
			expect(h2.textContent).toEqual(EXPECTED_DEFAULTS.HEADER_TITLE);
		});

		test('renders with single default anchor link with label [Go to the "Section Title" section] and has ID [#h2-section-title]', () => {
			const result = renderSvelteComponent(LinkableHeader);
			const component = getSvelteElementFromRenderResult(result);
			const anchor = getExpectedAnchorElementForHeader(component);
			expect(anchor.getAttribute('href')).toBe(`#h2-${EXPECTED_DEFAULTS.BASE_ID}`);
			expect(anchor.children[1].textContent).toBe(`Go to the "${EXPECTED_DEFAULTS.HEADER_TITLE}" section`);
		});

		test('renders with empty slots by default', () => {
			const result = renderSvelteComponent(LinkableHeader);
			const component = getSvelteElementFromRenderResult(result);
			expect(component.children.length).toBe(1); // only one child for header content
		});

		test('renders slotted content', () => {
			const result = renderSvelteComponent(
				SlotTest,
				{
					props: {
						componentUnderTest: LinkableHeader,
					}
				}
			);
			const component = getSvelteElementFromRenderResult(result);

			// ensure all other defaults are still present
			const h2 = getExpectedHeaderTitleElement(component, 'h2');
			expect(h2.id).toBe(`h2-${EXPECTED_DEFAULTS.BASE_ID}`);
			expect(h2.textContent).toEqual(EXPECTED_DEFAULTS.HEADER_TITLE);
			const anchor = getExpectedAnchorElementForHeader(component);
			expect(anchor.getAttribute('href')).toBe(`#h2-${EXPECTED_DEFAULTS.BASE_ID}`);
			expect(anchor.children[1].textContent).toBe(`Go to the "${EXPECTED_DEFAULTS.HEADER_TITLE}" section`);

			// the slot test component only has one element, resulting in 2 children in total
			expect(component.children.length).toBe(2);
			expect(component.querySelector('[data-testid="slot"]')).not.toBeNull();
		});
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
			// basic testing for h1-h6, h7+, and div cases, extended testing on DynamicLeveledHeader
			Array.from({ length: 6 }, (_, i) => i+1).forEach((headerLevel) => {
				const expectedHeaderTag = `h${headerLevel}`;
				test(`renders single [${expectedHeaderTag}] given level [${headerLevel}]`, () => {
					const result = renderSvelteComponent(LinkableHeader, { props: { level: headerLevel, title: expectedTitle }});
					const component = getSvelteElementFromRenderResult(result);

					const headerElement = getExpectedHeaderTitleElement(component, expectedHeaderTag);
					expect(headerElement.id).toBe(`${expectedHeaderTag}-${expectedBaseId}`);
					expect(headerElement.textContent).toEqual(expectedTitle);
				});

				test(`renders single anchor link given level [${headerLevel}]`, () => {
					const result = renderSvelteComponent(LinkableHeader, { props: { level: headerLevel, title: expectedTitle }});
					const component = getSvelteElementFromRenderResult(result);

					const anchor = getExpectedAnchorElementForHeader(component);
					expect(anchor.getAttribute('href')).toBe(`#${expectedHeaderTag}-${expectedBaseId}`);
					expect(anchor.children[1].textContent).toBe(`Go to the "${expectedTitle}" section`);
				});
			});

			test('renders single div with header role and aria-level attribute given larger header level than 6 [7]', () => {
				const result = renderSvelteComponent(LinkableHeader, { props: { level: 7, title: expectedTitle }});
				const component = getSvelteElementFromRenderResult(result);

				const headerElement = getExpectedHeaderTitleElement(component, 'div');
				expect(headerElement.getAttribute('role')).toBe('heading');
				expect(headerElement.getAttribute('aria-level')).toBe('7');
				expect(headerElement.id).toBe(`h7-${expectedBaseId}`);
				expect(headerElement.textContent).toEqual(expectedTitle);
			});

			test('renders single anchor link with ${testTitleCase} given larger header level than 6 [7]', () => {
				const result = renderSvelteComponent(LinkableHeader, { props: { level: 7, title: expectedTitle }});
				const component = getSvelteElementFromRenderResult(result);

				const anchor = getExpectedAnchorElementForHeader(component);
				expect(anchor.getAttribute('href')).toBe(`#h7-${expectedBaseId}`);
				expect(anchor.children[1].textContent).toBe(`Go to the "${expectedTitle}" section`);
			});

			test('renders single div given invalid header level [not-a-number-level]', () => {
				const result = renderSvelteComponent(LinkableHeader, { props: { level: 'not-a-number-level', title: expectedTitle }});
				const component = getSvelteElementFromRenderResult(result);

				const headerElement = getExpectedHeaderTitleElement(component, 'div');
				expect(headerElement.id).toBe(`hnot-a-number-level-${expectedBaseId}`);
				expect(headerElement.textContent).toEqual(expectedTitle);
			});

			test('renders single anchor link with ${testTitleCase} given invalid header level [not-a-number-level]', () => {
				const result = renderSvelteComponent(LinkableHeader, { props: { level: 'not-a-number-level', title: expectedTitle }});
				const component = getSvelteElementFromRenderResult(result);

				const anchor = getExpectedAnchorElementForHeader(component, );
				expect(anchor.getAttribute('href')).toBe(`#hnot-a-number-level-${expectedBaseId}`);
				expect(anchor.children[1].textContent).toBe(`Go to the "${expectedTitle}" section`);
			});
		});
	});
});
