/// <reference types="Cypress" />

describe('data-processing-systems', () => {
  beforeEach(() => {
    cy.requireIntercept();

    cy.setupDataProcessingIntercepts();
    cy.setup(true, 'data-processing');
  });

  it('System usage can be added', () => {
    cy.contains('Dpa 1').click();
    cy.navigateToDetailsSubPage('IT Systemer');

    cy.contains('Ingen systemer tilføjet endnu');
    cy.intercept('/api/v2/internal/data-processing-registrations/*/system-usages/available', {
      fixture: './dpr/data-processing-available-systems.json',
    });

    cy.getByDataCy('add-system-button').click();

    cy.get('app-dialog').within(() => {
      cy.dropdownByCy('system-usage-dropdown', 'test1', true);
      cy.getByDataCy('system-usage-save-button').click();
    });
    cy.get('app-popup-message').should('exist');
  });
});
