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
    cy.intercept('/api/v2/internal/organizations/*/grid/permissions', { statusCode: 404, body: {} });
    cy.intercept('/api/v2/internal/organizations/*/grid/*/*', { statusCode: 404, body: {} });
    cy.setup(true, 'it-systems/it-system-usages');
  });

  it('can add Used units by search', () => {
    cy.intercept('/api/v2/it-system-usages/*', { fixture: './it-system-usage/it-system-usage-no-organization.json' });

    cy.contains('System 3').click();

    cy.navigateToDetailsSubPage('Organisation');

    cy.intercept('/api/v2/organizations/*/organization-units*', {
      fixture: './organizations/organization-units-hierarchy.json',
    });

    cy.dropdownByCy('org-unit-select', 'Test - 1', true);

    cy.get('app-popup-message').should('exist');
  });

  it('can restrict number of levels', () => {
    cy.intercept('/api/v2/it-system-usages/*', { fixture: './it-system-usage/it-system-usage-no-organization.json' });

    cy.contains('System 3').click();

    cy.navigateToDetailsSubPage('Organisation');

    cy.intercept('/api/v2/organizations/*/organization-units*', {
      fixture: './organizations/organization-units-hierarchy.json',
    });

    cy.inputByCy('levels-input').type('1');

    cy.contains('Test - 1').should('not.exist');
  });

  it('can show Used units', () => {
    cy.intercept('/api/v2/it-system-usages/*', { fixture: './it-system-usage/it-system-usage.json' });

    cy.contains('System 3').click();

    cy.navigateToDetailsSubPage('Organisation');

    const expectedRows = [
      { uuid: '803fd406-27e2-4785-b162-02ee6ea876d1', name: 'Direktørområde' },
      { uuid: 'f4db9743-41e3-4a7a-ad62-683d10abe418', name: 'Test - 1' },
      { uuid: '933765a9-dad5-4a22-8d71-55b6798a094c', name: 'Test' },
      { uuid: '02d53ea4-0ba2-4e01-86d2-9044a4e4c81e', name: 'Test_28_11_2018' },
      { uuid: '16bab5a5-cff2-417b-bdeb-cf6033646d21', name: 'Kitos sekretariatet' },
    ];

    for (const expectedRow of expectedRows) {
      cy.contains(expectedRow.name);
    }
  });

  it('can select Responsible unit', () => {
    cy.intercept('/api/v2/it-system-usages/*', { fixture: './it-system-usage/it-system-usage.json' });

    cy.contains('System 3').click();

    cy.navigateToDetailsSubPage('Organisation');

    cy.intercept('patch', '/api/v2/it-system-usages/*', {
      fixture: './it-system-usage/it-system-usage-new-responsible-unit.json',
    });

    //select responsible unit
    cy.dropdown('Vælg ansvarlig organisationsenhed', 'Test - 1');

    //validate selected unit was updated
    cy.getCardWithTitle('Ansvarlig organisationsenhed').should('contain', 'Test - 1');
  });
});
