/// <reference types="cypress" />

describe('Notifications', () => {
  beforeEach(() => {
    cy.requireIntercept();

    cy.intercept('GET', 'api/v2/internal/notifications/*', {
      fixture: './shared/it-system-notifications.json',
    }).as('notifications');

    cy.intercept('GET', 'api/v2/internal/alerts/organization/*/user/*/*', {
      fixture: './shared/it-system-alerts.json',
    }).as('alerts');
  });

  it('Can see notifications', () => {
    cy.setup(true);

    cy.getByDataCy('notifications-button').click();

    cy.wait('@notifications');

    cy.contains('Ikke angivet').should('exist');
    cy.contains('asd').should('exist');
    cy.contains('12-12-2024').should('exist');
    cy.contains('test@user.dk').should('exist');
    cy.contains('Changemanager').should('exist');
  });

  it('Can see alerts', () => {
    cy.setup(true, 'notifications', undefined, false);
    cy.getByDataCy('alerts-segment').click();

    cy.contains('Ikke navngivet').should('exist');
    cy.contains('12-12-2024').should('exist');
    cy.contains('Advis kunne ikke sendes').should('exist');
  });

  it('Can delete alert', () => {
    cy.setup(true, 'notifications', undefined, false);
    cy.getByDataCy('alerts-segment').click();

    cy.intercept('DELETE', 'api/v2/internal/alerts/*', { statusCode: 204 }).as('deleteAlert');

    cy.getByDataCy('grid-delete-button').click();
    cy.getByDataCy('confirm-button').click();

    cy.wait('@deleteAlert');

    cy.contains('Ikke navngivet').should('not.exist');
    cy.contains('12-12-2024').should('not.exist');
    cy.contains('Advis kunne ikke sendes').should('not.exist');

    cy.get('app-popup-message').should('exist');
  });
});
