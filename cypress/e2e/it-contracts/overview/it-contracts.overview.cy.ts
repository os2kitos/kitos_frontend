/// <reference types="Cypress" />

describe('it-contracts', () => {
  beforeEach(() => {
    cy.requireIntercept();
    cy.intercept('/odata/ItContract*', { fixture: './it-contracts/it-contracts.json' });
    cy.setup(true, 'it-contracts');
  });

  it('can show IT contracts grid', () => {
    cy.get('h3').should('have.text', 'IT Kontrakter');

    cy.contains('Contract 1');
    cy.contains('Contract 2');
    cy.contains('Contract 3');
  });
});
