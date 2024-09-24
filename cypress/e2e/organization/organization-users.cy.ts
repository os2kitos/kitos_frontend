/// <reference types="Cypress" />

describe('organization-users', () => {
  beforeEach(() => {
    cy.requireIntercept();

    cy.intercept(
      '/odata/GetUsersByUuid(organizationUuid=**)?$expand=ObjectOwner,OrganizationRights($filter=Organization/Uuid%20eq%**),OrganizationUnitRights($filter=Object/Organization/Uuid%20eq%**;$expand=Object($select=Name,Uuid),Role($select=Name,Uuid,HasWriteAccess)),ItSystemRights($expand=Role($select=Name,Uuid,HasWriteAccess),Object($select=ItSystem,Uuid;$expand=ItSystem($select=Name))),ItContractRights($expand=Role($select=Name,Uuid,HasWriteAccess),Object($select=Name,Uuid)),DataProcessingRegistrationRights($expand=Role($select=Name,Uuid,HasWriteAccess),Object($select=Name,Uuid)),&$skip=0&$top=100&$count=true',
      { fixture: './organizations/organization-odata-users.json' }
    );
    cy.intercept('api/v2/internal/organization/*/users/permissions', { fixture: './shared/permissions.json' });
    cy.intercept('api/v2/internal/organizations/*/grid/permissions', { statusCode: 404, body: {} });

    cy.setup(true, 'organization/basic-info');
  });

  it('Can send advis', () => {
    //cy.intercept('**odata**', { fixture: './organizations/organization-odata-users.json' }).as('getUsers');
    ///cy.wait('@getUsers');

    cy.visit('/organization/users');

    cy.contains('b');
  });
});
