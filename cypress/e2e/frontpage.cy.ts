/// <reference types="Cypress" />

describe('frontpage', () => {
  it('can show frontpage', () => {
    cy.visit('/');

    cy.title().should('eq', 'Kitos');
    cy.get('p').first().should('have.text', 'Forside - blok 1');
  });
});
