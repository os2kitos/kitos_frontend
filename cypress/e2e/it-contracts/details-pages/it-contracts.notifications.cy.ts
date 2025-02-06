describe('it-contract-notifications', () => {
  beforeEach(() => {
    cy.requireIntercept();
    cy.setupContractIntercepts();
    cy.setup(true, 'it-contracts');
    cy.intercept('/api/v2/internal/notifications/ItContract*', {
      fixture: './it-contracts/notifications/it-contract-notifications.json',
    });
    cy.intercept('/api/v2/it-contract-role-types*', {
      fixture: './it-contracts/notifications/it-contract-role-types.json',
    });

    cy.contains('Contract 1').click();
    cy.navigateToDetailsSubPage('Advis');
  });

  it('Sent notifications shown when eye icon clicked', () => {
    cy.getByDataCy('notification-card-title').should('have.text', 'Advis');
    cy.intercept('/api/v2/internal/notifications/ItContract/*/sent/*', {
      fixture: './it-contracts/notifications/it-contract-notification-sent.json',
    });
    cy.getByDataCy('view-sent-notifications-button').first().click();
    cy.getByDataCy('notification-sent-date').its('length').should('eq', 5);
  });
});
