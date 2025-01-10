/// <reference types="Cypress" />

describe('it-system-usage', () => {
  beforeEach(() => {
    cy.requireIntercept();
    cy.setupItSystemUsageIntercepts();
    cy.setup(
      true,
      'it-systems/it-system-usages',
      './shared/it-system-usage-ui-customization-no-gdpr-and-lifecycle.json'
    );
  });

  it('does not show GDPR tab and lifecycle field disabled by local ui config', () => {
    cy.intercept('/api/v2/it-system-usages/*', { fixture: './it-system-usage/it-system-usage.json' });
    cy.contains('System 3').click();

    const disbledTabName = 'GDPR';
    const disabledFieldName = 'Livscyklus';

    cy.getByDataCy('navigation-drawer').within(() => {
      cy.contains(disbledTabName).should('not.exist');
    });

    cy.getByDataCy('system-usage-section').within(() => {
      cy.contains(disabledFieldName).should('not.exist');
    });
  });
});
