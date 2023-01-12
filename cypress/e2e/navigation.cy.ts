/// <reference types="Cypress" />

describe('navigation', () => {
  it('can navigate between pages', () => {
    cy.visit('/');
    cy.get('h3').first().should('have.text', 'Kitos - Kommunernes IT OverbliksSystem');

    cy.get('.login-button').click();

    cy.get('app-nav-bar').contains('Organisation').click();
    cy.get('h3').should('have.text', 'Organisation');

    cy.get('app-nav-bar').contains('IT systemer').click();
    cy.get('h3').should('have.text', 'IT systemer');

    cy.get('app-nav-bar').contains('IT kontrakter').click();
    cy.get('h3').should('have.text', 'IT kontrakter');

    cy.get('app-nav-bar').contains('Databehandling').click();
    cy.get('h3').should('have.text', 'Databehandling');

    cy.get('app-nav-bar').get('.logo-appbar-section').click();
    cy.get('h3').first().should('have.text', 'Kitos - Kommunernes IT OverbliksSystem');
  });
});
