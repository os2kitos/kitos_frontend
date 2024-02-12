/// <reference types="Cypress" />

describe('it-system-catalog', () => {
  beforeEach(() => {
    cy.requireIntercept();
    cy.intercept('/odata/ItSystems*', { fixture: './it-system-catalog/it-systems.json' });
    cy.setup(true, 'it-systems/it-system-catalog');
  });

  it('can show IT system usage grid', () => {
    cy.get('h3').should('have.text', 'IT Systemkatalog');

    cy.contains('System 1');
    cy.contains('System 2');
  });
});
