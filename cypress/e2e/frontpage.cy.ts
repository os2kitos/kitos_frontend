/// <reference types="Cypress" />

describe('frontpage', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('can show frontpage', () => {
    cy.title().should('eq', 'Kitos');
    cy.get('h3').first().should('have.text', 'Kitos - Kommunernes IT OverbliksSystem');
  });
});
