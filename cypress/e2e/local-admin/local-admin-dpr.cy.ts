/// <reference types="Cypress" />

describe('local-admin it system usage', () => {
  beforeEach(() => {
    cy.requireIntercept();
    cy.intercept('/api/v2/internal/organizations/*/permissions', {
      fixture: './organizations/organization-permissions-local-admin.json',
    });
    cy.setup(true, 'local-admin/data-processing');
  });

  it('Can hide dpr module', () => {
    cy.getByDataCy('dpr-nav-bar-item').should('exist');
    cy.intercept('PATCH', 'api/v2/internal/organizations/*/ui-root-config', {
      fixture: './local-admin/dpr/ui-root-config-no-dpr-module.json',
    }).as('patch');

    cy.getByDataCy('toggle-module-button').click();

    cy.wait('@patch').then((interception) => {
      const newValue = interception.request.body.showDataProcessing;
      expect(newValue).to.equal(false);
    });
    cy.getByDataCy('dpr-nav-bar-item').should('not.exist');
  });
});
