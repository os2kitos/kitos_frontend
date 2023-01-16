/// <reference types="Cypress" />

describe('frontpage', () => {
  it('can show frontpage', () => {
    cy.intercept('/api/Text', { fixture: 'text.json' });

    cy.visit('/');

    cy.title().should('eq', 'Kitos');
    cy.get('h3').first().should('have.text', 'Kitos - Kommunernes IT OverbliksSystem');
  });
});
