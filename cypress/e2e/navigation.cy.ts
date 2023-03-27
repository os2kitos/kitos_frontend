/// <reference types="Cypress" />

describe('navigation', () => {
  beforeEach(() => {
    cy.requireIntercept();
    cy.setup(true);
  });

  it('can navigate between pages', () => {
    cy.intercept('/odata/**', {});

    cy.contains('Kitos - Kommunernes IT OverbliksSystem');

    cy.get('app-nav-bar').contains('Organisation').click();
    cy.get('h3').should('have.text', 'Organisation');

    cy.get('app-nav-bar').contains('IT systemer').click();
    cy.get('h3').should('have.text', 'IT systemer i Fælles Kommune');

    cy.get('app-nav-bar').contains('IT kontrakter').click();
    cy.get('h3').should('have.text', 'IT kontrakter');

    cy.get('app-nav-bar').contains('Databehandling').click();
    cy.get('h3').should('have.text', 'Databehandling');

    cy.get('app-nav-bar').contains('Test User').click();
    cy.get('h3').should('have.text', 'Min profil');

    cy.get('app-nav-bar').get('img').first().click();
    cy.contains('Kitos - Kommunernes IT OverbliksSystem');
  });
});
