/// <reference types="Cypress" />

describe('organization-users', () => {
  beforeEach(() => {
    cy.requireIntercept();

    cy.intercept(
      '/odata/GetUsersByUuid(organizationUuid=**)?$expand=ObjectOwner,OrganizationRights($filter=Organization/Uuid%20eq%**),OrganizationUnitRights($filter=Object/Organization/Uuid%20eq%**;$expand=Object($select=Name,Uuid),Role($select=Name,Uuid,HasWriteAccess)),ItSystemRights($expand=Role($select=Name,Uuid,HasWriteAccess),Object($select=ItSystem,Uuid;$expand=ItSystem($select=Name))),ItContractRights($expand=Role($select=Name,Uuid,HasWriteAccess),Object($select=Name,Uuid)),DataProcessingRegistrationRights($expand=Role($select=Name,Uuid,HasWriteAccess),Object($select=Name,Uuid)),&$skip=0&$top=100&$count=true',
      { fixture: './organizations/users/organization-odata-users.json' }
    );
    cy.intercept('api/v2/internal/organization/*/users/permissions', {
      fixture: './organizations/users/permissions.json',
    });
    cy.intercept('api/v2/internal/organizations/*/grid/permissions', { statusCode: 404, body: {} });

    cy.setup(true, 'organization/users');
  });

  it('Can send advis', () => {
    cy.contains('local-api-global-admin-user@kitos.dk').click();

    cy.intercept('api/v2/internal/organization/*/users/*/notifications/send', {
      statusCode: 200,
      body: {},
    }).as('sendNotification');

    cy.contains('Send advis').click();

    cy.wait('@sendNotification');
  });

  it('Can delete organization unit role', () => {
    cy.contains('local-api-global-admin-user@kitos.dk').click();

    cy.get('[data-cy="delete-role-button-Chef"]').click();
    cy.contains('Ja').click();

    cy.intercept('DELETE', 'api/v2/internal/organizations/*/organization-units/*/roles/delete', {
      fixture: './organizations/users/org-unit-role-table-delete.json',
    }).as('deleteRole');

    cy.wait('@deleteRole');

    cy.contains('Chef').should('not.exist');
  });

  it('Can delete it system role', () => {
    cy.contains('local-api-global-admin-user@kitos.dk').click();

    cy.get('[data-cy="delete-role-button-Changemanager"]').click();
    cy.contains('Ja').click();

    cy.intercept('PATCH', 'api/v2/it-system-usages/*/roles/remove', {
      fixture: './organizations/users/it-system-role-table-delete.json',
    }).as('deleteRole');

    cy.wait('@deleteRole');

    cy.contains('Changemanager').should('not.exist');
  });

  it('Can delete it contract role', () => {
    cy.contains('local-api-global-admin-user@kitos.dk').click();

    cy.get('[data-cy="delete-role-button-Budgetansvarlig"]').click();
    cy.contains('Ja').click();

    cy.intercept('PATCH', 'api/v2/internal/it-contracts/*/roles/remove', {
      fixture: './organizations/users/it-contract-role-table-delete.json',
    }).as('deleteRole');

    cy.wait('@deleteRole');

    cy.contains('Budgetansvarlig').should('not.exist');
  });

  it('Can delete data processing role', () => {
    cy.contains('local-api-global-admin-user@kitos.dk').click();

    cy.get('[data-cy="delete-role-button-Standard Læserolle"]').click();
    cy.contains('Ja').click();

    cy.intercept('PATCH', 'api/v2/internal/data-processing-registrations/*/roles/remove', {
      fixture: './organizations/users/dpr-role-table-delete.json',
    }).as('deleteRole');

    cy.wait('@deleteRole');

    cy.contains('Standard Læserolle').should('not.exist');
  });

  it('Can create user', () => {
    cy.intercept('api/v2/internal/organization/*/users/*', { body: null });

    cy.getByDataCy('grid-options-button').click().click();
    cy.getByDataCy('create-button').click();

    cy.inputByCy('first-name').type('Test');
    cy.inputByCy('last-name').type('User');
    cy.inputByCy('email').type('test@email.com');
    cy.inputByCy('repeat-email').type('test@email.com');
    cy.inputByCy('phone-number').type('12345678');
    cy.dropdownByCy('start-preference', 'Start side', true);
    cy.getByDataCy('send-on-creation').find('input').click();
    cy.getByDataCy('rights-holder-access').find('input').click();
    cy.getByDataCy('api-user').find('input').click();
    cy.getByDataCy('stake-holder-access').find('input').click();

    cy.intercept('POST', 'api/v2/internal/organization/*/users/create', { body: {} });
    cy.getByDataCy('create-user-button').click();

    cy.get('app-popup-message').should('exist');
  });

  it('Cannot create user if emails differ', () => {
    cy.intercept('api/v2/internal/organization/*/users/*', { body: null });

    cy.getByDataCy('grid-options-button').click().click()
    cy.getByDataCy('create-button').click({scrollBehavior: 'center'});

    cy.inputByCy('email').type('test@email.com');
    cy.inputByCy('repeat-email').type('test2@email.com');

    cy.getByDataCy('create-user-button').find('button').should('be.disabled');
  });

  it('Can edit user', () => {
    cy.intercept('api/v2/internal/organization/*/users/*', { body: null });

    cy.contains('local-regular-user@kitos.dk').click();
    cy.contains('Rediger').click().wait(500);

    cy.replaceTextByDataCy('firstName', 'Jens');
    cy.replaceTextByDataCy('lastName', 'Jensen');
    cy.replaceTextByDataCy('email', 'jens@jensen.dk'), cy.replaceTextByDataCy('phoneNumber', '12345678');
    cy.dropdownByCy('start-preference', 'Organisation', true);
    cy.getByDataCy('rights-holder-access').find('input').click();
    cy.getByDataCy('stakeholder-access').find('input').click();
    cy.getByDataCy('api-access').find('input').click();

    cy.intercept('PATCH', 'api/v2/internal/organization/*/users/*/patch', (req) => {
      expect(req.body).to.have.property('firstName', 'Jens');
      expect(req.body).to.have.property('lastName', 'Jensen');
      expect(req.body).to.have.property('email', 'jens@jensen.dk');
      expect(req.body).to.have.property('phoneNumber', '12345678');
      expect(req.body).to.have.property('defaultUserStartPreference', 'Organization');
      expect(req.body.roles).to.include.members(['User', 'RightsHolderAccess']);
      expect(req.body).to.have.property('hasApiAccess', true);
      expect(req.body).to.have.property('hasStakeHolderAccess', true);

      req.reply({ statusCode: 200, body: {} });
    }).as('patchRequest');
    cy.getByDataCy('save-button').click({scrollBehavior: 'center'});

    cy.wait('@patchRequest');
    cy.get('app-popup-message').should('exist');
  });

  it('Can delete user', () => {
    cy.intercept('api/v2/internal/organization/*/users/*', { body: null });
    cy.intercept('api/v2/internal/organizations/*/ui-root-config', {
      fixture: './shared/ui-root-config.json',
    });

    cy.intercept('DELETE', 'api/v2/internal/organization/*/users/*', { body: {} }).as('deleteUser');

    cy.contains('local-regular-user@kitos.dk').click();
    cy.contains('Slet bruger').click({scrollBehavior: 'center'});

    cy.getByDataCy('delete-button').click();
    cy.contains('Ja').click();

    cy.wait('@deleteUser');
  });

});
