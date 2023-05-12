/// <reference types="Cypress" />

describe('frontpage', () => {
  beforeEach(() => {
    cy.requireIntercept();
    cy.setup();
  });

  it('can show frontpage', () => {
    cy.title().should('eq', 'Kitos');
    cy.contains('Kitos - Kommunernes IT OverbliksSystem');
  });
});
