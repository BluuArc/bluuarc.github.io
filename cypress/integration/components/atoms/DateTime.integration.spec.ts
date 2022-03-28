/// <reference types="Cypress" />
/// <reference types="cypress-real-events" />

import 'cypress-real-events/support';

describe('DateTime', () => {
	const TOOLTIP_ELEMENT_SELECTOR = '[role="tooltip"]';
	const TIME_ELEMENT_SELECTOR = 'time';

	beforeEach(() => {
		cy.visit('http://localhost:8080/integration/components/atoms/date-time');

		cy.get('#focus-reset').realClick();
	});

	describe('tooltip visibility behavior', () => {
		const expectTooltipElementVisibility = (tooltipElement: HTMLElement, isVisible: boolean) => {
			if (isVisible) {
				expect(tooltipElement.innerText).to.match(/^Actual time is/);
			} else {
				// innerText for hidden elements is empty string
				expect(tooltipElement.innerText).to.equal('');
			}
		};

		it('has tooltip invisible by default', () => {
			cy.get(TOOLTIP_ELEMENT_SELECTOR)
				.should(($tooltip) => {
					const tooltipElement = $tooltip[0];

					expectTooltipElementVisibility(tooltipElement, false);

					// assert textContent to ensure that we have the right element
					expect(tooltipElement.textContent).to.match(/^Actual time is/);
				});
		});

		it('shows tooltip on hover and hides tooltip on other element hover', () => {
			cy.get(TIME_ELEMENT_SELECTOR).realHover();

			cy.get(TOOLTIP_ELEMENT_SELECTOR)
				.should(($tooltip) => {
					const tooltipElement = $tooltip[0];
					expectTooltipElementVisibility(tooltipElement, true);
				});

			cy.get('#focus-reset').realHover();

			cy.get(TOOLTIP_ELEMENT_SELECTOR)
				.should(($tooltip) => {
					const tooltipElement = $tooltip[0];
					expectTooltipElementVisibility(tooltipElement, false);
				});
		});

		describe('keyboard behavior', () => {
			it('shows tooltip on keyboard focus and hides tooltip on other element keyboard focus', () => {
				cy.realPress('Tab');

				cy.get(TOOLTIP_ELEMENT_SELECTOR)
					.should(($tooltip) => {
						const tooltipElement = $tooltip[0];
						expectTooltipElementVisibility(tooltipElement, true);
					});

				cy.realPress(['Shift', 'Tab']);

				cy.get(TOOLTIP_ELEMENT_SELECTOR)
					.should(($tooltip) => {
						const tooltipElement = $tooltip[0];
						expectTooltipElementVisibility(tooltipElement, false);
					});
			});

			it('hides tooltip when is focused via keyboard and escape key is pressed', () => {
				cy.realPress('Tab');

				cy.get(TOOLTIP_ELEMENT_SELECTOR)
					.should(($tooltip) => {
						const tooltipElement = $tooltip[0];
						expectTooltipElementVisibility(tooltipElement, true);
					});

				cy.realPress('Escape');

				cy.get(TOOLTIP_ELEMENT_SELECTOR)
					.should(($tooltip) => {
						const tooltipElement = $tooltip[0];
						expectTooltipElementVisibility(tooltipElement, false);
					});
			});

			it('shows tooltip after escape key is pressed and has been refocused', () => {
				cy.realPress('Tab');

				cy.get(TOOLTIP_ELEMENT_SELECTOR)
					.should(($tooltip) => {
						const tooltipElement = $tooltip[0];
						expectTooltipElementVisibility(tooltipElement, true);
					});

				cy.realPress('Escape');

				cy.get(TOOLTIP_ELEMENT_SELECTOR)
					.should(($tooltip) => {
						const tooltipElement = $tooltip[0];
						expectTooltipElementVisibility(tooltipElement, false);
					});

				cy.realPress(['Shift', 'Tab'])
					.realPress('Tab');

				cy.get(TOOLTIP_ELEMENT_SELECTOR)
					.should(($tooltip) => {
						const tooltipElement = $tooltip[0];
						expectTooltipElementVisibility(tooltipElement, true);
					});
			});
		});
	});

	describe('tooltip positioning behavior', () => {
		it('shows tooltip above the time element by default', () => {
			cy.get(TIME_ELEMENT_SELECTOR)
				.realHover()
				.then(($time) => {
					cy.get(TOOLTIP_ELEMENT_SELECTOR)
						.should(($tooltip) => {
							const tooltipElement = $tooltip[0];
							const timeElement = $time[0];

							const tooltipBoundingRect = tooltipElement.getBoundingClientRect();
							const timeBoundingRect = timeElement.getBoundingClientRect();
							expect(tooltipBoundingRect.bottom).to.be.lessThan(timeBoundingRect.top);
						});
				});
		});

		it('shows tooltip below the time element when there is not enough vertical space above the time element', () => {
			cy.get('.component-wrapper')
				.then(($componentWrapper) => {
					$componentWrapper[0].setAttribute('style', 'align-content: start');
				});

			cy.get(TIME_ELEMENT_SELECTOR)
				.realHover()
				.then(($time) => {
					cy.get(TOOLTIP_ELEMENT_SELECTOR)
						.should(($tooltip) => {
							const tooltipElement = $tooltip[0];
							const timeElement = $time[0];

							const tooltipBoundingRect = tooltipElement.getBoundingClientRect();
							const timeBoundingRect = timeElement.getBoundingClientRect();
							expect(tooltipBoundingRect.top).to.be.greaterThan(timeBoundingRect.bottom);
						});
				});
		});
	});
});
