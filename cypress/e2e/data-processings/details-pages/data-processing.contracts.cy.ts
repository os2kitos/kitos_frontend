/// <reference types="Cypress" />

describe('data-processing-contracts', () => {
  beforeEach(() => {
    cy.requireIntercept();

    cy.setupDataProcessingIntercepts();
    cy.intercept('/api/v2/data-processing-registration-data-responsible-types*', {
      fixture: './dpr/choice-types/data-responsible-types.json',
    });
    cy.intercept('PATCH', '/api/v2/data-processing-registrations/*', {
      fixture: './dpr/data-processing-registration-patch.json',
    });
    cy.setup(true, 'data-processing');
  });

  it('Main contract can be selected', () => {
    cy.contains('Dpa 1').click();
    cy.navigateToDetailsSubPage('IT Kontrakter');

    cy.contains('DefaultTestItContract');

    cy.dropdownByCy('dpr-main-contract', 'DefaultTestItContract', true);
  });
});
