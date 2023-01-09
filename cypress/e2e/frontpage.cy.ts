/// <reference types="Cypress" />

describe('frontpage', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('can show frontpage', () => {
    cy.title().should('eq', 'Kitos');
    cy.get('h3').should('have.text', 'Forside');
  });
});
