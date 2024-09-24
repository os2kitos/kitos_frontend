/// <reference types="Cypress" />

describe('organization-users', () => {
  beforeEach(() => {
    cy.requireIntercept();

    cy.intercept(
      'odata/GetUsersByUuid**',
      { fixture: './organizations/organization-odata-users.json' }
    );
    cy.intercept('api/v2/internal/organization/*/users/permissions', { fixture: './shared/permissions.json' });
    cy.intercept('api/v2/internal/organizations/*/grid/permissions', { statusCode: 404, body: {} });

    cy.setup(true, 'organization/users');
  });

  it('Can send advis', () => {
    cy.wait(500);
    cy.intercept(
      'odata/GetUsersByUuid**',
      { fixture: './organizations/organization-odata-users.json' }
    );
    cy.contains('b');
  });
});
