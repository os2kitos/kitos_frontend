import { TestRunner } from 'cypress/support/test-runner';

function setupTest() {
  cy.requireIntercept();
  cy.setupItSystemUsageIntercepts();
  cy.setup(true, 'it-systems/it-system-usages');

  cy.intercept('/api/v2/internal/notifications/*', {
    fixture: './it-system-usage/notifications/it-system-usage-notifications.json',
  });
  cy.intercept('/api/v2/it-system-usage-role-types*', {
    fixture: './it-system-usage/notifications/it-system-usage-role-types.json',
  });

  cy.contains('System 3').click();

  cy.navigateToDetailsSubPage('Advis');
}

describe('it-system-usage notifications', () => {
  const testRunner = new TestRunner(setupTest);

  it('it-system-usage notifications', () => {
    testRunner.runTestWithSetup('Notifications are displayed in a table', () => {
      cy.getByDataCy('notification-card-title').should('have.text', 'Advis');

      cy.getByDataCy('is-active-column').should('exist');
      cy.getByDataCy('name-column').should('exist');
      cy.getByDataCy('last-sent-column').should('exist');
      cy.getByDataCy('from-date-column').should('exist');
      cy.getByDataCy('to-date-column').should('exist');
      cy.getByDataCy('receivers-column').should('exist');
      cy.getByDataCy('ccs-column').should('exist');
      cy.getByDataCy('title-column').should('exist');

      cy.getRowForElementContent('test1')
        .first()
        .within(() => {
          cy.get('app-check-negative-gray-icon');
          cy.contains('Changemanager');
          cy.contains('Forretningsejer');
        });

      const expectedFromDate = '24-02-2024';
      const expectedLastSent = expectedFromDate;
      const expectedToDate = '26-02-2024';

      cy.getRowForElementContent('test2')
        .first()
        .within(() => {
          cy.get('app-check-positive-green-icon');
          cy.contains('TestName');
          cy.contains(expectedFromDate);
          cy.contains(expectedLastSent);
          cy.contains(expectedToDate);
          cy.contains('test@test.com');
          cy.contains('Changemanager');
          cy.contains('test2@test2.com');
          cy.contains('Forretningsejer');
        });
    });

    testRunner.runTestWithSetup('Can deactivate and delete notifications', () => {
      cy.getRowForElementContent('test2')
        .first()
        .within(() => {
          cy.getByDataCy('deactivate-button').click();
        });
      cy.getByDataCy('confirm-dialog').within(() => {
        cy.intercept(
          'PATCH',
          '/api/v2/internal/notifications/ItSystemUsage/85cc6bd8-da66-4d4e-8e56-4dbc16e5c109/scheduled/deactivate/310ea75c-1111-4bcd-1111-a19543b0dcc5',
          { fixture: './it-system-usage/notifications/notifications-deactivate.json' }
        ).as('patch');
        cy.getByDataCy('confirm-button').click();
        cy.verifyRequestUsingDeepEq('patch', 'response.body.uuid', '310ea75c-1111-4bcd-1111-a19543b0dcc5');
      });
    });

    testRunner.runTestWithSetup('Can add notification', () => {
      const recipient = 'test@test.dk';
      const subject = 'testSubject';
      const body = 'testBody';

      cy.intercept('POST', '/api/v2/internal/notifications/*', {
        fixture: './it-system-usage/notifications/it-system-usage-post-notification.json',
      }).as('postNewNotification');
      cy.getByDataCy('add-notification-button').click();

      cy.getByDataCy('notifications-dialog')
        .should('be.visible')
        .within(() => {
          cy.getByDataCy('recipient-dropdown').type(recipient).type('{enter}');
          cy.dropdownByCy('notification-type-dropdown', 'Straks', true);
          cy.getByDataCy('subject-textbox').type('testSubject');
          cy.setTinyMceContent('rich-text-editor', 'testBody');
          cy.getIframe().click({ force: true });

          cy.intercept('POST', '/api/v2/internal/notifications/ItSystemUsage/*/immediate', {
            fixture: './it-system-usage/notifications/it-system-usage-post-notification.json',
          }).as('postNewNotification');
          cy.getByDataCy('confirm-button').click();

          const expectedProperties = {
            receivers: { emailRecipients: [recipient] },
            subject: subject,
            body: body,
            notificationType: 'Immediate',
          };
          cy.wait('@postNewNotification')
            .its('response.body')
            .then((body) => {
              expect(body.notificationType).to.deep.eq(expectedProperties.notificationType);
              expect(body.subject).to.deep.eq(expectedProperties.subject);
              expect(body.body).to.deep.eq(expectedProperties.body);
              expect(body.receivers.emailRecipients).to.deep.eq(expectedProperties.receivers.emailRecipients);
            });
        });
    });

    testRunner.runTestWithSetup('Can not create a notification after clearing the recipients', () => {
      const notificationDialogSelector = 'notifications-dialog';
      cy.getByDataCy('add-notification-button').click();

      cy.getByDataCy('recipient-dropdown').click();
      cy.get('.select-option-row').first().click();
      cy.getByDataCy(notificationDialogSelector).click(); //Click elsewhere to unfocus and close the dropdown
      cy.getByDataCy('subject-textbox').type('testSubject');
      cy.setTinyMceContent('rich-text-editor', 'testBody');
      cy.getIframe().click({ force: true });
      cy.getByDataCy(notificationDialogSelector).click();
      cy.get('ng-select').first().find('.ng-clear-wrapper').click();
      cy.getByDataCy(notificationDialogSelector).click(); //Click elsewhere to unfocus the dropdown and trigger form validation

      cy.getByDataCy('confirm-button').within(() => {
        cy.getByDataCy('mat-button').should('be.disabled');
      });
    });
  });
});
