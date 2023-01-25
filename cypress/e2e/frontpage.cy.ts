/// <reference types="Cypress" />

describe('frontpage', () => {
  it('can show frontpage', () => {
    cy.intercept('/api/v2/internal/public-messages', { fixture: 'public-messages.json' });
    cy.visit('/');

    cy.title().should('eq', 'Kitos');
    cy.contains('Kitos - Kommunernes IT OverbliksSystem').should('exist');
  });
});
