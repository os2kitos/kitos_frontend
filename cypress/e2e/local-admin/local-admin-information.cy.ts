/// <reference types="Cypress" />

describe('local-admin', () => {
  beforeEach(() => {
    cy.requireIntercept();
    cy.setup(true);
  });

  it('can edit just organization name if local admin', () => {
    const newName = 'someOrg';
    cy.intercept('/api/v2/internal/organizations/*/patch').as('patch');
    cy.intercept(
      'http://localhost:4200/api/v2/internal/organizations/3dc52c64-3706-40f4-bf58-45035bb376da/permissions',
      {
        fixture: './organizations/organization-permissions-local-admin.json',
      }
    );

    cy.hoverByDataCy('profile-menu');
    cy.getByDataCy('local-admin-menu-item').should('exist').click();

    cy.confirmTextboxStateByDataCy('name-input', true);
    cy.confirmTextboxStateByDataCy('cvr-input', false);
  });
});
