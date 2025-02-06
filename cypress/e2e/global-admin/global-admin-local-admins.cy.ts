/// <reference types="Cypress" />

describe('global-admin-local-admins', () => {
  beforeEach(() => {
    cy.requireIntercept();

    cy.intercept('api/v2/internal/users/local-admins', { fixture: './global-admin/local-admins.json' });
    cy.setup(true, 'global-admin/local-admins');
  });

  it('Can add local admin', () => {
    cy.intercept('api/v2/internal/users/search', { fixture: './global-admin/users.json' }).as('users');
    cy.intercept('api/v2/organizations', { fixture: './organizations/organizations-multiple.json' }).as(
      'organizations'
    );

    cy.contains('Opret lokal administrator').click();

    cy.wait('@users');
    cy.wait('@organizations');

    cy.intercept('POST', 'api/v2/internal/users/*/local-admins/*', {
      body: { name: 'Jens Jensen', email: 'test@email.dk', organization: { name: 'En organisation' } },
      statusCode: 200,
    }).as('addLocalAdmin');

    cy.dropdownByCy('user-dropdown', 'Api User', true);
    cy.dropdownByCy('organization-dropdown', 'Organisation 2', true);
    cy.getByDataCy('create-local-admin-dialog-button').click();

    cy.wait('@addLocalAdmin');

    cy.contains('Jens Jensen').should('exist');
    cy.contains('test@email.dk').should('exist');
    cy.contains('En organisation').should('exist');

    cy.get('app-popup-message').should('exist');
  });

  it('Can remove local admin', () => {
    cy.getByDataCy('grid-delete-button').first().click();

    cy.intercept('DELETE', 'api/v2/internal/users/*/local-admins/*', { statusCode: 204 }).as('removeLocalAdmin');

    cy.getByDataCy('confirm-button').click();

    cy.wait('@removeLocalAdmin');

    cy.contains('Test organisation to').should('not.exist');
    cy.contains('Automatisk oprettet testbruger (LocalAdmin)').should('not.exist');
    cy.contains('local-local-admin-user@kitos.dk').should('not.exist');

    cy.get('app-popup-message').should('exist');
  });
});
