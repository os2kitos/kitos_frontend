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

  it('can show interfaces when no associated interfaces', () => {
    cy.contains('System 3').click();

    cy.intercept('/api/v2/it-interfaces*includeDeactivated*', []);
    cy.intercept('/api/v2/it-interface-interface-types*', []);

    cy.navigateToDetailsSubPage('Udstillede snitflader');

    cy.contains('Systemet udstiller ingen snitflader');
  });

  it('can show interfaces with 2 associated interfaces', () => {
    cy.contains('System 3').click();

    cy.intercept('/api/v2/it-interfaces*includeDeactivated*', { fixture: './it-interfaces/it-interfaces.json' });
    cy.intercept('/api/v2/it-interface-interface-types*', { fixture: './it-interfaces/it-interfaces-types.json' });

    cy.navigateToDetailsSubPage('Udstillede snitflader');

    const expectedRows = [
      {
        name: 'Interface 1 - ACTIVE',
        deactivated: true,
        description: 'Test description 1',
        itInterfaceType: {
          name: 'InterfaceType1',
        },
        urlReference: 'http://www.kitos.dk',
      },
      {
        name: 'Interface 2 - INACTIVE',
        deactivated: false,
        description: 'Test description 2',
        itInterfaceType: {
          name: 'InterfaceType2 (udgået)',
        },
        urlReference: '', //since the url doesn't contain 'http' it should be invalid
      },
    ];

    cy.get('tr').should('have.length', expectedRows.length);
    expectedRows.forEach((row) => {
      const rowElement = cy.contains(row.name);
      rowElement
        .parentsUntil('tr')
        .parent('tr')
        .within(() => {
          cy.get('td')
            .eq(1)
            .contains(row.deactivated ? 'Ikke aktiv' : 'Aktiv');
          cy.get('td').eq(2).contains(row.itInterfaceType.name);
          cy.get('td').eq(3).contains(row.description);

          if (row.urlReference.includes('http')) {
            cy.get('td').eq(4).verifyExternalReferenceHrefValue('Læs mere', row.urlReference);
          }
        });
    });
  });
});
