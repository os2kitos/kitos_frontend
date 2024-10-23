/// <reference types="Cypress" />

describe('local-admin.fk-org', () => {
  beforeEach(() => {
    cy.requireIntercept();

    cy.intercept('api/v2/internal/organizations/*/permissions', {
      fixture: './organizations/organization-permissions-local-admin.json',
    });

    cy.intercept('api/v2/internal/organizations/*/sts-organization-synchronization/snapshot', {
      fixture: './local-admin/fk-org/snapshot.json',
    });
    cy.setup(true);
  });

  it('can create synchronization', () => {
    cy.intercept('api/v2/internal/organizations/*/sts-organization-synchronization/connection-status', {
      fixture: './local-admin/fk-org/empty-connection-status.json',
    });
    goToImport();

    cy.contains('Adgang');
    cy.contains('KITOS har adgang til organisationens data via FK Organisation');
    cy.contains('Synkronisering');
    cy.contains('Organisationen er ikke forbundet til FK Organisation');

    cy.getByDataCy('create-sts-connection').click();

    cy.contains('Test Kommune Root');
    cy.contains('Test child 1');
    cy.contains('Test grandchild');

    cy.inputByCy('levels-input').type('2');
    cy.getByDataCy('auto-updates-checkbox').click();

    cy.contains('Test Kommune Root');
    cy.contains('Test child 1');
    cy.contains('Test grandchild').should('not.exist');

    cy.inputByCy('levels-input').clear().type('1');
    cy.getByDataCy('auto-updates-checkbox').click();

    cy.contains('Test Kommune Root');
    cy.contains('Test child 1').should('not.exist');
    cy.contains('Test grandchild').should('not.exist');
  });

  it('can update synchronization', () => {
    cy.intercept('api/v2/internal/organizations/*/sts-organization-synchronization/connection-status', {
      fixture: './local-admin/fk-org/existing-connection-status.json',
    });
    cy.intercept('api/v2/internal/organizations/*/sts-organization-synchronization/connection/update*', {
      fixture: './local-admin/fk-org/consequences.json',
    });
    goToImport();

    cy.getByDataCy('edit-sts-connection').click();
    cy.getByDataCy('delete-connection').should('exist');
    cy.getByDataCy('proceed-button').click();

    cy.inputByCy('levels-input').should('be.disabled');

    cy.contains('Unit 1');

    cy.getByDataCy('cancel-button').should('exist');
    cy.getByDataCy('save-button').should('exist');
  });

  it('can delete auto synchronization', () => {
    cy.intercept('api/v2/internal/organizations/*/sts-organization-synchronization/connection-status', {
      fixture: './local-admin/fk-org/existing-connection-status.json',
    });

    cy.intercept('api/v2/internal/organizations/*/sts-organization-synchronization/connection/subscription', {
      body: {},
    });

    goToImport();

    cy.intercept('api/v2/internal/organizations/*/sts-organization-synchronization/connection-status', {
      fixture: './local-admin/fk-org/empty-connection-status.json',
    });

    cy.getByDataCy('delete-sts-auto-update').click();
    cy.getByDataCy('confirm-button').click();

    cy.getByDataCy('delete-sts-auto-update').should('not.exist');
  });
});

function goToImport() {
  cy.hoverByDataCy('profile-menu');
  cy.getByDataCy('local-admin-menu-item').should('exist').click();

  cy.navigateToDetailsSubPage('Masseopret');
}
