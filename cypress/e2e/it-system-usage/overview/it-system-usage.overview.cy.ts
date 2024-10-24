/// <reference types="Cypress" />

describe('it-system-usage', () => {
  beforeEach(() => {
    cy.requireIntercept();
    cy.intercept('/odata/ItSystemUsageOverviewReadModels*', { fixture: './it-system-usage/it-system-usages.json' });
    cy.intercept('/api/v1/itsystem-usage/options/overview/organizationUuid*', {});
    cy.intercept('/api/v2/organizations/*/organization-units*', {});
    cy.intercept('/api/v2/business-types*', {});
    cy.intercept('/api/v2/internal/organizations/*/grid/permissions', { statusCode: 404, body: {} });
    cy.intercept('/api/v2/internal/organizations/*/grid/*/*', { statusCode: 404, body: {} });
  });

  it('can show IT system usage grid', () => {
    cy.setup(true, 'it-systems/it-system-usages');
    cy.get('h3').should('have.text', 'IT Systemer i Fælles Kommune');

    cy.contains('System 1');
    cy.contains('System 2');
    cy.contains('System 3');
  });

  it('does not show gdpr columns hidden by local ui config', () => {
    cy.setup(true, 'it-systems/it-system-usages', './shared/it-system-usage-ui-customization-no-gdpr-and-lifecycle.json');
    cy.get('h3').should('have.text', 'IT Systemer i Fælles Kommune');

    const gpdrColumnNames = [
      'DataType',
      'Risikovurdering',
      'Fortegnelse',
      'Systemets overordnede formål',
      'Dato for seneste risikovurdering',
      'Dato for seneste risikovurdering',
    ];

    gpdrColumnNames.forEach((columnName) => {
      cy.contains(columnName).should('not.exist');
    });
  });
});
