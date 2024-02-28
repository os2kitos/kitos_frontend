describe('it-system-usage', () => {
  beforeEach(() => {
    cy.requireIntercept();
    cy.intercept('/odata/ItSystemUsageOverviewReadModels*', { fixture: './it-system-usage/it-system-usages.json' });
    cy.intercept('/api/v2/it-system-usage-data-classification-types*', {
      fixture: './it-system-usage/classification-types.json',
    });
    cy.intercept('/api/v2/it-system-usages/*/permissions', { fixture: './shared/permissions.json' });
    cy.intercept('/api/v2/it-systems/*', { fixture: 'it-system.json' }); //gets the base system
    cy.intercept('/api/v2/it-system-usages/*', { fixture: './it-system-usage/it-system-usage.json' });
    cy.setup(true, 'it-systems/it-system-usages');

    cy.intercept('/api/v2/internal/notifications/*', {
      fixture: './it-system-usage/notifications/it-system-usage-notifications.json',
    });
    cy.intercept('/api/v2/it-system-usage-role-types*', {
      fixture: './it-system-usage/notifications/it-system-usage-role-types.json',
    });

    cy.contains('System 3').click();

    cy.navigateToDetailsSubPage('Advis');
  });

  it('Notifications are displayed in a table', () => {
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
        cy.contains('Nej');
        cy.contains('Changemanager');
        cy.contains('Forretningsejer');
      });

    const expectedFromDate = new Date("2024-02-24T21:00:00Z").toLocaleDateString();
    const expectedLastSent = expectedFromDate;
    const expectedToDate = new Date("2024-02-26T21:00:00Z").toLocaleDateString();

    cy.getRowForElementContent('test2')
      .first()
      .within(() => {
        cy.contains('Ja');
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

  it('Can add notification', () => {
    const recipient = 'test@test.dk';
    const subject = 'testSubject';
    const body = 'testBody';

    cy.intercept('POST', '/api/v2/internal/notifications/*', {
    fixture: './it-system-usage/notifications/it-system-usage-post-notification.json',
    }).as('postNewNotification')

    cy.getByDataCy('add-notification-button').click();

    cy.getByDataCy('notifications-dialog').within(() => {

      cy.getByDataCy('email-recipient-accordion').click().getByDataCy('email-recipient-textbox').type(recipient);
      cy.dropdownByCy('notification-type-dropdown', 'Straks', true)
      cy.getByDataCy('subject-textbox').type('testSubject')
      cy.setTinyMceContent('body-editor', 'testBody')
      cy.getIframe().click({force: true})
      //Clicks twice to first defocus body editor and update form value, then save the notification.
      //This is required because the Cypress interacts with the editor by "setting" content rather than typing.
      cy.getByDataCy('confirm-button').click()

      cy.getByDataCy('confirm-button').click()

      const expectedProperties = {receivers: {emailRecipients: [recipient]},
        subject: subject,
        body: body,
        notificationType: "Immediate"
      }
      cy.wait('@postNewNotification').its('body').should('deep.eq', expectedProperties)
    });


  });
});
