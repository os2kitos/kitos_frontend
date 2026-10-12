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

  [
    { page: 'it-systems', resourceType: 'ItSystemUsage', detailsPath: 'it-systems/it-system-usages' },
    { page: 'it-contracts', resourceType: 'ItContract', detailsPath: 'it-contracts/contracts' },
    { page: 'data-processing', resourceType: 'DataProcessingRegistration', detailsPath: 'data-processing' },
  ].forEach(({ page, resourceType, detailsPath }) => {
    it(`Keeps ${page} notification links matched to their rows after filtering and sorting`, () => {
      const firstUuid = '11111111-1111-4111-8111-111111111111';
      const secondUuid = '22222222-2222-4222-8222-222222222222';
      cy.intercept('GET', 'api/v2/internal/notifications/*', {
        body: [
          {
            uuid: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
            name: 'Alpha notification',
            ownerResourceType: resourceType,
            ownerResource: { uuid: firstUuid, name: 'Alpha resource' },
          },
          {
            uuid: 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
            name: 'Beta notification',
            ownerResourceType: resourceType,
            ownerResource: { uuid: secondUuid, name: 'Beta resource' },
          },
        ],
      }).as('filteredNotifications');

      cy.setup(true, `notifications/${page}`);
      cy.wait('@filteredNotifications');

      const grid = 'app-notifications-grid';
      const links = `${grid} app-details-page-link a`;
      const assertLink = (name: string, uuid: string) => {
        cy.contains(links, name).should('have.attr', 'href').and('include', `/${detailsPath}/${uuid}/notifications`);
      };

      cy.get(links).should('have.length', 2);
      assertLink('Alpha notification', firstUuid);
      assertLink('Beta notification', secondUuid);

      cy.get(`${grid} app-string-filter input`).first().type('Beta');
      cy.get(links).should('have.length', 1);
      assertLink('Beta notification', secondUuid);

      cy.get(`${grid} app-string-filter input`).first().clear();
      cy.get(links).should('have.length', 2);
      assertLink('Alpha notification', firstUuid);
      assertLink('Beta notification', secondUuid);

      cy.contains(`${grid} th`, 'Navn').click();
      cy.get(links).first().should('contain.text', 'Alpha notification');
      cy.contains(`${grid} th`, 'Navn').click();
      cy.get(links).first().should('contain.text', 'Beta notification');
      assertLink('Alpha notification', firstUuid);
      assertLink('Beta notification', secondUuid);
    });
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
