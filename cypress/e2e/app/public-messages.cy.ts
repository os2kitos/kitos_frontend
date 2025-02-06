/// <reference types="Cypress" />

describe('public messages', () => {
  beforeEach(() => {
    cy.requireIntercept();
  });

  it('Can not edit public messages if not global admin', () => {
    cy.setup(false);
    cy.login('./shared/authorize-no-rights.json');

    cy.getByDataCy('edit-public-message-button').should('not.exist');
  });

  it('Can edit public messages if global admin', () => {
    cy.setup(true);

    cy.getByDataCy('edit-public-message-button').first().click();

    cy.intercept('PATCH', '/api/v2/internal/public-messages').as('editPublicMessages');

    cy.getByDataCy('save-public-message-button').click();

    cy.wait('@editPublicMessages');

    cy.get('app-popup-message').should('exist');
  });
});
