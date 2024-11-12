/// <reference types="Cypress" />

describe('global-admin other', () => {
  beforeEach(() => {
    cy.requireIntercept();
    cy.intercept('/api/v2/internal/organizations/*/permissions', {
      fixture: './organizations/organization-permissions-local-admin.json',
    });
    cy.intercept('api/v2/internal/organizations/*/grid/permissions', { statusCode: 404, body: {} });
    cy.intercept('/odata/Organizations?$skip=0&$top=100&$count=true', { fixture: './global-admin/organizations.json' });

    cy.intercept('api/v2/internal/kle/status', { fixture: './global-admin/kle-status-not-up-to-date.json' });

    cy.intercept('api/v2/internal/users/search', { fixture: './shared/users.json' });
    cy.intercept('api/v2/internal/users/*/organizations', { fixture: './organizations/organizations.json' });

    cy.intercept('api/v2/internal/organizations/*/ui-root-config', { body: {} });

    cy.intercept('api/v2/internal/organizations/*/grid/permissions', { statusCode: 404, body: {} });

    cy.intercept('/odata/Organizations?$skip=0&$top=100&$count=true', { fixture: './global-admin/organizations.json' });
    cy.setup(true, 'global-admin/other');
  });

  it('can perform kle update', () => {
    cy.intercept('api/v2/internal/kle/status', { fixture: './global-admin/kle-status-not-up-to-date.json' });

    cy.intercept('api/v2/internal/kle/changes', {
      fixture: './global-admin/kle-changes.csv',
    });
    cy.intercept('api/v2/internal/kle/update', {
      body: {},
    });

    cy.getByDataCy('update-kle-button').get('button').should('be.disabled');
    cy.getByDataCy('get-kle-changes-button').click();
    cy.getByDataCy('get-kle-changes-button').get('button').should('be.disabled');

    cy.intercept('api/v2/internal/kle/status', { fixture: './global-admin/kle-status-up-to-date.json' });
    cy.getByDataCy('update-kle-button').click();

    cy.getByDataCy('update-kle-button').get('button').should('be.disabled');
    cy.getByDataCy('get-kle-changes-button').get('button').should('be.disabled');
  });

  it('can shutdown user', () => {
    cy.intercept('DELETE', 'api/v2/internal/users/*', { body: {} });
    cy.dropdownByCy('remove-user-dropdown', 'test', true);

    cy.getByDataCy('delete-user-button').click();
    cy.getByDataCy('confirm-button').click();

    cy.get('app-popup-message').should('exist');
  });
});
