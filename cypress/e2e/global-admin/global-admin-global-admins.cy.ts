/// <reference types="Cypress" />

describe('global-admin-global-admins', () => {
  beforeEach(() => {
    cy.requireIntercept();

    cy.intercept('api/v2/internal/users/global-admins', { fixture: './global-admin/global-admins.json' });
    cy.setup(true, 'global-admin/global-admins');
  });

  it('Can add global admin', () => {
    cy.intercept('api/v2/internal/users/search', { fixture: './global-admin/create-global-admin-users.json' }).as(
      'search'
    );

    cy.getByDataCy('add-global-admin-button').click();
    cy.dropdownByCy('add-global-admin-dropdown', 'Api User', true);

    cy.intercept('POST', 'api/v2/internal/users/global-admins/*', {
      body: { name: 'Jens Jensen', email: 'test@email.dk' },
    }).as('addGlobalAdmin');

    cy.getByDataCy('add-global-admin-dialog-button').click();

    cy.wait('@addGlobalAdmin');

    cy.contains('Jens Jensen').should('exist');
    cy.contains('test@email.dk').should('exist');

    cy.get('app-popup-message').should('exist');
  });

  it('Can remove global admin', () => {
    cy.getByDataCy('remove-global-admin-button').first().click();

    cy.intercept('DELETE', 'api/v2/internal/users/global-admins/*', { statusCode: 204 }).as('removeGlobalAdmin');

    cy.getByDataCy('confirm-button').click();

    cy.wait('@removeGlobalAdmin');

    cy.contains('Automatisk oprettet testbruger (Api GlobalAdmin)').should('not.exist');
    cy.contains('local-api-global-admin-user@kitos.dk').should('not.exist');

    cy.get('app-popup-message').should('exist');
  });
});
