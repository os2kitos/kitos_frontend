/// <reference types="Cypress" />

describe('navigation', () => {
  beforeEach(() => {
    cy.intercept('/api/v2/internal/public-messages', { fixture: 'public-messages.json' });
    cy.visit('/');
  });

  it('can navigate between pages', () => {
    cy.contains('Kitos - Kommunernes IT OverbliksSystem').should('exist');

    cy.contains('Test log ind').click();

    cy.get('app-nav-bar').contains('Organisation').click();
    cy.get('h3').should('have.text', 'Organisation');

    cy.get('app-nav-bar').contains('IT systemer').click();
    cy.get('h3').should('have.text', 'IT systemer');

    cy.get('app-nav-bar').contains('IT kontrakter').click();
    cy.get('h3').should('have.text', 'IT kontrakter');

    cy.get('app-nav-bar').contains('Databehandling').click();
    cy.get('h3').should('have.text', 'Databehandling');

    cy.get('app-nav-bar').get('.logo-appbar-section').click();
    cy.contains('Kitos - Kommunernes IT OverbliksSystem').should('exist');
  });
});
