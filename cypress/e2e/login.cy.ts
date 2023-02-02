/// <reference types="Cypress" />

describe('login', () => {
  beforeEach(() => {
    cy.requireIntercept();
    cy.setup();
  });

  it('shows error on failed login', () => {
    cy.intercept('/api/authorize/antiforgery', '"ABC"');
    cy.intercept('/api/Authorize', { statusCode: 401, fixture: 'authorize-401.json' });

    cy.contains('Email').type('test@test.com');
    cy.contains('Password').type('123456');
    cy.contains('Log ind').click();

    cy.contains('Kunne ikke logge ind');
  });

  it('shows error on failed logout', () => {
    cy.login();

    cy.intercept('/api/authorize/log-out', { statusCode: 401, fixture: 'authorize-401.json' });

    cy.get('app-nav-bar').contains('Test User').click();
    cy.contains('Log ud').click();

    cy.contains('Kunne ikke logge ud');
  });

  it('can login and logout', () => {
    cy.login();

    cy.contains('Du er nu logget ind');
    cy.contains('Test User');

    cy.intercept('/api/authorize/log-out', { fixture: 'authorize-401.json' });

    cy.get('app-nav-bar').contains('Test User').click();
    cy.contains('Log ud').click();

    cy.contains('Du er nu logget ud');
    cy.contains('Email');
    cy.contains('Password');
    cy.contains('Log ind');
  });

  it('can authenticate with loading spinner', () => {
    cy.contains('Email');
    cy.contains('Password');

    cy.intercept('/api/Authorize', (req) => {
      req.reply({
        delay: 1000,
        fixture: 'authorize.json',
      });
    });

    cy.visit('/');

    cy.get('app-loading');
    cy.contains('Test User');
  });

  it('can login with multiple organizations and switch organization', () => {
    cy.intercept('/api/v2/organizations*', { fixture: 'organizations-multiple.json' });
    cy.login();

    cy.contains('Du er nu logget ind');
    cy.contains('Vælg organisation');
    cy.get('input').click().get('.ng-dropdown-panel-items').contains('Organisation 2').click();

    cy.get('app-nav-bar').contains('Organisation 2');

    cy.get('app-nav-bar').contains('Test User').click();
    cy.contains('Skift organisation').click();

    cy.contains('Vælg organisation');
    cy.get('input').click().get('.ng-dropdown-panel-items').contains('Organisation 1').click();

    cy.get('app-nav-bar').contains('Organisation 1');
  });
});
