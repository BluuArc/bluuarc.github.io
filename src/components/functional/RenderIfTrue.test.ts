import { renderSvelteComponent } from '@src/utilities/_test-utils/svelte-test-utils';
import type { RenderResult } from '@testing-library/svelte';
import RenderIfTrue from './RenderIfTrue.svelte';
import SlotTest from './_RenderIfTrueSlotTest.svelte';

describe('RenderIfTrue', () => {
	const getContainerOfSvelteElementFromRenderResult = (result: RenderResult) => {
		// default container is document.body, and there is a wrapper div around the Svelte element
		return result.container.children[0];
	};

	const getSlottedElementsForBothSlots = (container: Element) => {
		const truthySlottedElement = container.querySelector('[data-testid="slot"]');
		const falsySlottedElement = container.querySelector('[data-testid="slot-else"]');
		return { truthySlottedElement, falsySlottedElement };
	};

	const EXPECTED_TRUTHY_CASES = [
		{ ifCondition: true, scenario: 'ifCondition [true]' },
		{ ifCondition: 'truthy value', scenario: 'truthy ifCondition [string "truthy value"]' },
		{ ifCondition: 1, scenario: 'truthy ifCondition [number 1]' },
		{ ifCondition: { some: 'truthy object' }, scenario: 'truthy ifCondition [object]' },
		{ ifCondition: {}, scenario: 'truthy ifCondition [empty object]' },
	];
	const EXPECTED_FALSY_CASES = [
		{ scenario: 'no value for ifCondition' },
		{ ifCondition: false, scenario: 'ifCondition [false]' },
		{ ifCondition: null, scenario: 'falsy ifCondition [null]' },
		{ ifCondition: void 0, scenario: 'falsy ifCondition [undefined[' },
		{ ifCondition: '', scenario: 'falsy ifCondition [empty string]' },
		{ ifCondition: 0, scenario: 'falsy ifCondition [0]' },
	];

	[...EXPECTED_TRUTHY_CASES, ...EXPECTED_FALSY_CASES].forEach((testCase) => {
		test(`renders nothing by default when given ${testCase.scenario}`, () => {
			let props;
			if ('ifCondition' in testCase) {
				props = { props: { ifCondition: testCase.ifCondition }}
			}
			const result = renderSvelteComponent(RenderIfTrue, props);
			const container = getContainerOfSvelteElementFromRenderResult(result);
			expect(container.innerHTML).toBe('');
		});
	});

	EXPECTED_TRUTHY_CASES.forEach((testCase) => {
		test(`renders default slot and not the 'else' slot when given ${testCase.scenario}`, () => {
			const result = renderSvelteComponent(
				SlotTest,
				{
					props: {
						componentUnderTest: RenderIfTrue,
						ifCondition: testCase.ifCondition,
					},
				},
			);
			const container = getContainerOfSvelteElementFromRenderResult(result);
			const { truthySlottedElement, falsySlottedElement } = getSlottedElementsForBothSlots(container);
			expect(truthySlottedElement).not.toBeNull();
			expect(truthySlottedElement.textContent).toBe('Test Data for if clause');
			expect(falsySlottedElement).toBeNull();
		});
	});

	EXPECTED_FALSY_CASES.forEach((testCase) => {
		test(`renders 'else' slot and not default slot when given ${testCase.scenario}`, () => {
			const props = {
				props: { componentUnderTest: RenderIfTrue, ifCondition: testCase.ifCondition }
			};
			if (!('ifCondition' in testCase)) {
				delete props.props.ifCondition;
			}
			const result = renderSvelteComponent(SlotTest, props);
			const container = getContainerOfSvelteElementFromRenderResult(result);
			const { truthySlottedElement, falsySlottedElement } = getSlottedElementsForBothSlots(container);
			expect(truthySlottedElement).toBeNull();
			expect(falsySlottedElement).not.toBeNull();
			expect(falsySlottedElement.textContent).toBe('Test Data for else clause');
		});
	});
});