/// <reference types="Cypress" />
/// <reference types="cypress-real-events" />

import 'cypress-real-events/support';

describe('DateTime', () => {
	beforeEach(() => {
		cy.visit('http://localhost:8080/integration/components/atoms/date-time');

		cy.get('#focus-reset').realClick();
	});

	describe('tooltip visibility behavior', () => {
		const TEST_CASE_SECTION_SELECTOR = '[date-test-scenario="keyboard-shortcuts"]';
		const generateQuerySelectorInTestCase = (selector: string) => `${TEST_CASE_SECTION_SELECTOR} ${selector}`;
		const generateTooltipQuerySelector = () => generateQuerySelectorInTestCase('[role="tooltip"]');

		const expectTooltipElementVisibility = (tooltipElement: HTMLElement, isVisible: boolean) => {
			if (isVisible) {
				expect(tooltipElement.innerText).to.match(/^Actual time is/);
			} else {
				// innerText for hidden elements is empty string
				expect(tooltipElement.innerText).to.equal('');
			}
		};

		it('has tooltip invisible by default', () => {
			cy.get(generateTooltipQuerySelector())
				.should(($tooltip) => {
					const tooltipElement = $tooltip[0];

					expectTooltipElementVisibility(tooltipElement, false);

					// assert textContent to ensure that we have the right element
					expect(tooltipElement.textContent).to.match(/^Actual time is/);
				});
		});

		it('shows tooltip on hover and hides tooltip on other element hover', () => {
			cy.get('time').realHover();

			cy.get(generateTooltipQuerySelector())
				.should(($tooltip) => {
					const tooltipElement = $tooltip[0];
					expectTooltipElementVisibility(tooltipElement, true);
				});

			cy.get('#focus-reset').realHover();

			cy.get(generateTooltipQuerySelector())
				.should(($tooltip) => {
					const tooltipElement = $tooltip[0];
					expectTooltipElementVisibility(tooltipElement, false);
				});
		});

		describe('keyboard behavior', () => {
			it('shows tooltip on keyboard focus and hides tooltip on other element keyboard focus', () => {
				cy.realPress('Tab');

				cy.get(generateTooltipQuerySelector())
					.should(($tooltip) => {
						const tooltipElement = $tooltip[0];
						expectTooltipElementVisibility(tooltipElement, true);
					});

				cy.realPress(['Shift', 'Tab']);
				cy.get(generateTooltipQuerySelector())
				.should(($tooltip) => {
					const tooltipElement = $tooltip[0];
					expectTooltipElementVisibility(tooltipElement, false);
				});
			});

			it('hides tooltip when is focused via keyboard and escape key is pressed', () => {
				cy.realPress('Tab');

				cy.get(generateTooltipQuerySelector())
					.should(($tooltip) => {
						const tooltipElement = $tooltip[0];
						expectTooltipElementVisibility(tooltipElement, true);
					});

				cy.realPress('Escape');

				cy.get(generateTooltipQuerySelector())
					.should(($tooltip) => {
						const tooltipElement = $tooltip[0];
						expectTooltipElementVisibility(tooltipElement, false);
					});
			});

			it('shows tooltip after escape key is pressed and has been refocused', () => {
				cy.realPress('Tab');

				cy.get(generateTooltipQuerySelector())
					.should(($tooltip) => {
						const tooltipElement = $tooltip[0];
						expectTooltipElementVisibility(tooltipElement, true);
					});

				cy.realPress('Escape');

				cy.get(generateTooltipQuerySelector())
					.should(($tooltip) => {
						const tooltipElement = $tooltip[0];
						expectTooltipElementVisibility(tooltipElement, false);
					});

				cy.realPress(['Shift', 'Tab']);
				cy.realPress('Tab');

				cy.get(generateTooltipQuerySelector())
					.should(($tooltip) => {
						const tooltipElement = $tooltip[0];
						expectTooltipElementVisibility(tooltipElement, true);
					});
			});
		});
	});
});
