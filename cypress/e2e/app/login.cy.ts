/// <reference types="Cypress" />

describe('login', () => {
  beforeEach(() => {
    cy.requireIntercept();
    cy.setup();
  });

  it('shows error on failed login', () => {
    cy.intercept('/api/authorize/antiforgery', '"ABC"');
    cy.intercept('/api/Authorize', { statusCode: 401, fixture: './shared/authorize-401.json' });

    cy.contains('Email').parent().find('input').type('test@test.com');
    cy.contains('Password').parent().find('input').type('123456');
    cy.contains('Log ind').click();

    cy.contains('Kunne ikke logge ind');
  });

  it('shows error on failed logout', () => {
    cy.login();

    cy.intercept('/api/authorize/log-out', { statusCode: 401, fixture: './shared/authorize-401.json' });

    cy.get('app-nav-bar').contains('Test User').trigger('mouseenter');
    cy.contains('Log ud').click();

    cy.contains('Kunne ikke logge ud');
  });

  it('can login and logout', () => {
    cy.login();

    cy.contains('Du er nu logget ind');
    cy.contains('Test User');

    cy.intercept('/api/authorize/log-out', { fixture: './shared/authorize-401.json' });

    cy.get('app-nav-bar').contains('Test User').trigger('mouseenter');
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
        fixture: './shared/authorize.json',
      });
    });

    cy.visit('/');

    cy.get('app-loading');
    cy.contains('Test User');
  });

  it('can login with multiple organizations and switch organization', () => {
    cy.intercept('/api/v2/organizations*', { fixture: './organizations/organizations-multiple.json' });
    cy.login();

    cy.contains('Du er nu logget ind');
    cy.contains('Vælg organisation');

    cy.get('app-dialog').within(() => {
      cy.dropdown('Organisation', 'Organisation 2', true);
    });

    cy.get('app-nav-bar').contains('Organisation 2');

    cy.get('app-nav-bar').contains('Test User').trigger('mouseenter');
    cy.contains('Skift organisation').click();

    cy.contains('Vælg organisation');
    cy.get('app-dialog').within(() => {
      cy.dropdown('Organisation', 'Organisation 1', true);
    });

    cy.get('app-nav-bar').contains('Organisation 1');
  });

  it('can switch organization on a details page', () => {
    cy.intercept('/api/v2/organizations*', { fixture: './organizations/organizations-multiple.json' });
    cy.login();

    cy.get('app-dialog').within(() => {
      cy.dropdown('Organisation', 'Organisation 2', true);
    });

    cy.intercept('/odata/ItSystemUsageOverviewReadModels*', { fixture: './it-system-usage/it-system-usages.json' });
    cy.intercept('/api/v1/itsystem-usage/options/overview/organizationUuid*', {
      fixture: './it-system-usage/options.json',
    });
    cy.intercept('/api/v2/organizations/*/organization-units?pageSize=*', {
      fixture: './organizations/organization-units-hierarchy.json',
    });
    cy.intercept('/api/v2/business-types*', { fixture: './shared/business-types.json' });
    cy.intercept('/api/v2/it-system-usages/*', { fixture: './it-system-usage/it-system-usage.json' });
    cy.intercept('/api/v2/it-systems/*', { fixture: 'it-system.json' }); //gets the base system
    cy.intercept('/api/v2/it-system-usage-data-classification-types*', {
      fixture: './it-system-usage/classification-types.json',
    });
    cy.intercept('/api/v2/it-system-usages/*/permissions', { fixture: './shared/permissions.json' });

    cy.visit('it-systems/it-system-usages');
    cy.contains('System 3').click();
    cy.contains('Systeminformation');

    cy.get('app-nav-bar').contains('Test User').trigger('mouseenter');
    cy.contains('Skift organisation').click();

    // Stay on details page when choosen same organisation
    cy.contains('Vælg organisation');
    cy.get('app-dialog').within(() => {
      cy.dropdown('Organisation', 'Organisation 1', true);
    });

    cy.contains('Systeminformation');

    cy.get('app-nav-bar').contains('Test User').trigger('mouseenter');
    cy.contains('Skift organisation').click();

    // Go back when changing organisation
    cy.contains('Vælg organisation');
    cy.get('app-dialog').within(() => {
      cy.dropdown('Organisation', 'Organisation 2', true);
    });

    cy.get('h3').should('have.text', 'IT Systemer i Organisation 2');
  });

  it('logs out if user has no organizations', () => {
    cy.intercept('/api/v2/organizations*', []);
    cy.intercept('/api/authorize/log-out', { fixture: './shared/authorize-401.json' });

    cy.login();

    cy.contains('Du er nu logget ud');
  });
});
