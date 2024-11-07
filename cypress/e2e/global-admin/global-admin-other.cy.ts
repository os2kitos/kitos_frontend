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
    cy.setup(true, 'global-admin/other');
  });

  it('Can download kle changes', () => {
    cy.intercept('api/v2/internal/kle/changes', {
      fixture: './global-admin/kle-changes.csv',
    });

    cy.hoverByDataCy('profile-menu');
    cy.getByDataCy('global-admin-menu-item').should('exist').click();

    cy.navigateToDetailsSubPage('Andet');
  });
});
