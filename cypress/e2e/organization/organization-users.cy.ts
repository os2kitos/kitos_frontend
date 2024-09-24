/// <reference types="Cypress" />

describe('organization-users', () => {
  beforeEach(() => {
    cy.requireIntercept();

    cy.intercept(
      '/odata/GetUsersByUuid(organizationUuid=**)?$expand=ObjectOwner,OrganizationRights($filter=Organization/Uuid%20eq%**),OrganizationUnitRights($filter=Object/Organization/Uuid%20eq%**;$expand=Object($select=Name,Uuid),Role($select=Name,Uuid,HasWriteAccess)),ItSystemRights($expand=Role($select=Name,Uuid,HasWriteAccess),Object($select=ItSystem,Uuid;$expand=ItSystem($select=Name))),ItContractRights($expand=Role($select=Name,Uuid,HasWriteAccess),Object($select=Name,Uuid)),DataProcessingRegistrationRights($expand=Role($select=Name,Uuid,HasWriteAccess),Object($select=Name,Uuid)),&$skip=0&$top=100&$count=true',
      { fixture: './organizations/users/organization-odata-users.json' }
    );
    cy.intercept('api/v2/internal/organization/*/users/permissions', { fixture: './shared/permissions.json' });
    cy.intercept('api/v2/internal/organizations/*/grid/permissions', { statusCode: 404, body: {} });

    cy.setup(true, 'organization/users');
  });

  /* it('Can send advis', () => {
    cy.contains('local-api-global-admin-user@kitos.dk').click();

    cy.contains('Send advis').click();
    cy.intercept('api/v2/internal/organization//users/', {
      statusCode: 200,
      body: {},
    }).as('sendNotification');

    cy.wait('@sendNotification');
  }); */

  it('Can delete organization unit role', () => {
    cy.contains('local-api-global-admin-user@kitos.dk').click();

    cy.get('[data-cy="delete-role-button-Chef"]').click();
    cy.contains('Ja').click();

    cy.intercept('DELETE', "api/v2/internal/organizations/*/organization-units/*/roles/delete", {fixture: './organizations/users/org-unit-role-table-delete.json'}).as('deleteRole');

    cy.wait('@deleteRole');

    cy.contains('Chef').should('not.exist');
  });

  it('Can delete it system role', () => {
    cy.contains('local-api-global-admin-user@kitos.dk').click();

    cy.get('[data-cy="delete-role-button-Changemanager"]').click();
    cy.contains('Ja').click();

    cy.intercept('PATCH', "api/v2/it-system-usages/*/roles/remove", {fixture: './organizations/users/it-system-role-table-delete.json'}).as('deleteRole');

    cy.wait('@deleteRole');

    cy.contains('Changemanager').should('not.exist');
  });

  it('Can delete it contract role', () => {
    cy.contains('local-api-global-admin-user@kitos.dk').click();

    cy.get('[data-cy="delete-role-button-Budgetansvarlig"]').click();
    cy.contains('Ja').click();

    cy.intercept('PATCH', "api/v2/internal/it-contracts/*/roles/remove", {fixture: './organizations/users/it-contract-role-table-delete.json'}).as('deleteRole');

    cy.wait('@deleteRole');

    cy.contains('Budgetansvarlig').should('not.exist');
  });

  it('Can delete data processing role', () => {
    cy.contains('local-api-global-admin-user@kitos.dk').click();

    cy.get('[data-cy="delete-role-button-Standard Læserolle"]').click();
    cy.contains('Ja').click();

    cy.intercept('PATCH', "api/v2/internal/data-processing-registrations/*/roles/remove", {fixture: './organizations/users/dpr-role-table-delete.json'}).as('deleteRole');

    cy.wait('@deleteRole');

    cy.contains('Standard Læserolle').should('not.exist');
  });

});
