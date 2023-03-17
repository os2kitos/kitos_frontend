/// <reference types="Cypress" />

describe('login', () => {
  beforeEach(() => {
    cy.requireIntercept();
    cy.setup();
  });

  it('shows error on failed login', () => {
    cy.intercept('/api/authorize/antiforgery', '"ABC"');
    cy.intercept('/api/Authorize', { statusCode: 401, fixture: 'authorize-401.json' });

    cy.contains('Email').parent().find('input').type('test@test.com');
    cy.contains('Password').parent().find('input').type('123456');
    cy.contains('Log ind').click();

    cy.contains('Kunne ikke logge ind');
  });

  it('shows error on failed logout', () => {
    cy.login();

    cy.intercept('/api/authorize/log-out', { statusCode: 401, fixture: 'authorize-401.json' });

    cy.get('app-nav-bar').contains('Test User').trigger('mouseover');
    cy.contains('Log ud').click();

    cy.contains('Kunne ikke logge ud');
  });

  it('can login and logout', () => {
    cy.login();

    cy.contains('Du er nu logget ind');
    cy.contains('Test User');

    cy.intercept('/api/authorize/log-out', { fixture: 'authorize-401.json' });

    cy.get('app-nav-bar').contains('Test User').trigger('mouseover');
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

    cy.get('app-dialog').within(() => {
      cy.dropdown('Organisation', 'Organisation 2');
    });

    cy.get('app-nav-bar').contains('Organisation 2');

    cy.get('app-nav-bar').contains('Test User').trigger('mouseover');
    cy.contains('Skift organisation').click();

    cy.contains('Vælg organisation');
    cy.get('app-dialog').within(() => {
      cy.dropdown('Organisation', 'Organisation 1');
    });

    cy.get('app-nav-bar').contains('Organisation 1');
  });

  it('can switch organization on a details page', () => {
    cy.intercept('/api/v2/organizations*', { fixture: 'organizations-multiple.json' });
    cy.login();

    cy.get('app-dialog').within(() => {
      cy.dropdown('Organisation', 'Organisation 2');
    });

    cy.intercept('/odata/ItSystemUsageOverviewReadModels*', { fixture: 'it-system-usages.json' });
    cy.intercept('/api/v2/it-system-usages/*', { fixture: 'it-system-usage.json' });
    cy.intercept('/api/v2/it-system-usage-data-classification-types*', { fixture: 'classification-types.json' });
    cy.intercept('/api/v2/it-system-usages/*/permissions', { fixture: 'permissions.json' });

    cy.visit('it-systems/it-system-usages');
    cy.contains('System 3').click();
    cy.contains('IT system information');

    cy.get('app-nav-bar').contains('Test User').trigger('mouseover');
    cy.contains('Skift organisation').click();

    // Stay on details page when choosen same organisation
    cy.contains('Vælg organisation');
    cy.get('app-dialog').within(() => {
      cy.input('Organisation').clear();
    });
    cy.get('kendo-popup').contains('Organisation 1').click();

    cy.contains('IT system information');

    cy.get('app-nav-bar').contains('Test User').trigger('mouseover');
    cy.contains('Skift organisation').click();

    // Go back when changing organisation
    cy.contains('Vælg organisation');
    cy.get('app-dialog').within(() => {
      cy.dropdown('Organisation', 'Organisation 2');
    });

    cy.get('h3').should('have.text', 'IT systemer i Organisation 2');
  });

  it('logs out if user has no organizations', () => {
    cy.intercept('/api/v2/organizations*', []);
    cy.intercept('/api/authorize/log-out', { fixture: 'authorize-401.json' });

    cy.login();

    cy.contains('Du er nu logget ud');
  });
});
