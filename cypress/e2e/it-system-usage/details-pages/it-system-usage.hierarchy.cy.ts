/// <reference types="Cypress" />

describe('it-system-usage', () => {
  beforeEach(() => {
    cy.requireIntercept();
    cy.intercept('/odata/ItSystemUsageOverviewReadModels*', { fixture: './it-system-usage/it-system-usages.json' });
    cy.intercept('/api/v1/itsystem-usage/options/overview/organizationUuid*', {
      fixture: './it-system-usage/options.json',
    });
    cy.intercept('/api/v2/organizations/*/organization-units?pageSize=*', {
      fixture: './organizations/organization-units-hierarchy.json',
    });
    cy.intercept('/api/v2/business-types*', { fixture: './shared/business-types.json' });
    cy.intercept('/api/v2/it-system-usages/*', { fixture: './it-system-usage/it-system-usage.json' });
    cy.intercept('/api/v2/it-system-usage-data-classification-types*', {
      fixture: './it-system-usage/classification-types.json',
    });
    cy.intercept('/api/v2/it-system-usages/*/permissions', { fixture: './shared/permissions.json' });
    cy.intercept('/api/v2/it-systems/*', { fixture: 'it-system.json' }); //gets the base system
    cy.intercept('/api/v2/internal/organizations/*/grid-configuration/ItSystemUsage/get', {statusCode: 404, body: {}});
    cy.setup(true, 'it-systems/it-system-usages');
  });

  it('shows simple hierarchy', () => {
    cy.intercept('/api/v2/it-systems/*/hierarchy', { fixture: './it-system-usage/hierarchy.json' });

    cy.contains('System 3').click();
    cy.navigateToDetailsSubPage('Hierarki');

    cy.get('app-it-system-hierarchy-table').within(() => {
      cy.contains('System 1');
      cy.contains('System 2');
    });
  });

  it('shows complex hierarchy', () => {
    cy.intercept('/api/v2/it-systems/*/hierarchy', { fixture: './it-system-usage/hierarchy-complex.json' });

    cy.contains('System 3').click();
    cy.navigateToDetailsSubPage('Hierarki');

    cy.get('app-it-system-hierarchy-table').within(() => {
      cy.contains('System 1');
      cy.contains('System 2');
      cy.contains('System 4');
      cy.contains('System 6');
    });
  });
});
