/// <reference types="Cypress" />

describe('login', () => {
  beforeEach(() => {
    cy.setup();
  });

  it('shows error on failed login', () => {
    cy.intercept('/api/authorize/antiforgery', '"ABC"');
    cy.intercept('/api/Authorize', { statusCode: 401, fixture: 'authorize-401.json' });

    cy.contains('Email').type('test@test.com');
    cy.contains('Password').type('123456');
    cy.contains('Log ind').click();

    cy.contains('Kunne ikke logge ind').should('exist');
  });

  it('shows error on failed logout', () => {
    cy.login();

    cy.intercept('/api/Authorize?logout', { statusCode: 401, fixture: 'authorize-401.json' });

    cy.get('app-nav-bar').contains('Test User').click();
    cy.contains('Log ud').click();

    cy.contains('Kunne ikke logge ud').should('exist');
  });

  it('can login and logout', () => {
    cy.login();

    cy.contains('Du er nu logget ind').should('exist');
    cy.contains('Test User').should('exist');

    cy.intercept('/api/authorize/log-out', { fixture: 'authorize-401.json' });

    cy.get('app-nav-bar').contains('Test User').click();
    cy.contains('Log ud').click();

    cy.contains('Du er nu logget ud').should('exist');
    cy.contains('Email').should('exist');
    cy.contains('Password').should('exist');
    cy.contains('Log ind').should('exist');
  });
});
