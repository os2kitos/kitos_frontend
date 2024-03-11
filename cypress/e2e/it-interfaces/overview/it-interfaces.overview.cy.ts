/// <reference types="Cypress" />

describe('it-interfaces', () => {
  beforeEach(() => {
    cy.requireIntercept();
    cy.intercept('/odata/ItInterfaces*', { fixture: './it-interfaces/odata/it-interfaces.json' });
    cy.setup(true, 'it-systems/it-interfaces');
  });

  it('can show IT interfaces grid', () => {
    cy.get('h3').should('have.text', 'IT Snitfladekatalog');

    cy.contains('Interface 1');
    cy.contains('Interface 2');
  });
});
