/// <reference types="Cypress" />

describe('login', () => {
  beforeEach(() => {
    cy.setup();
  });

  it('shows error on failed login', () => {
    cy.intercept('/api/authorize/antiforgery', '"ABC"');
    cy.intercept('/api/authorize', { statusCode: 401, fixture: 'authorize-401.json' });

    cy.contains('Email').type('test@test.com');
    cy.contains('Password').type('123456');
    cy.contains('Log ind').click();

    cy.contains('Kunne ikke logge ind').should('exist');
  });

  it('can login and logout', () => {
    cy.login();

    cy.contains('Du er logget ind som: Test User').should('exist');

    cy.intercept('/api/authorize?logout', { fixture: 'authorize-401.json' });

    cy.get('app-nav-bar').contains('Test User').click();

    cy.contains('Email').should('exist');
    cy.contains('Password').should('exist');
    cy.contains('Log ind').should('exist');
  });
});
