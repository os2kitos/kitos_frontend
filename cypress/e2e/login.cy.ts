/// <reference types="Cypress" />

describe('login', () => {
  beforeEach(() => {
    cy.intercept('/api/v2/internal/public-messages', { fixture: 'public-messages.json' });
    cy.visit('/');
  });

  it('shows error on failed login', () => {
    cy.intercept('/api/authorize/antiforgery', '"ABC"');
    cy.intercept('/api/authorize', { statusCode: 400 });

    cy.contains('Email').type('test@test.com');
    cy.contains('Password').type('123456');
    cy.contains('Log ind').click();

    cy.contains('Kunne ikke logge ind').should('exist');
  });

  it('can login and logout', () => {
    cy.intercept('/api/authorize/antiforgery', '"ABC"');
    cy.intercept('/api/authorize', { fixture: 'authorize.json' });

    cy.contains('Email').type('test@test.com');
    cy.contains('Password').type('123456');
    cy.contains('Log ind').click();

    cy.contains('Du er logget ind som: Test User').should('exist');

    cy.get('app-nav-bar').contains('Test User').click();

    cy.contains('Email').should('exist');
    cy.contains('Password').should('exist');
    cy.contains('Log ind').should('exist');
  });
});
