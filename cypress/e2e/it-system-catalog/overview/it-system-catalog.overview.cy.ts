/// <reference types="Cypress" />

describe('it-system-catalog', () => {
  beforeEach(() => {
    cy.requireIntercept();
    cy.intercept('/odata/ItSystems*', { fixture: './it-system-catalog/it-systems.json' });
    cy.intercept('/api/v2/it-systems/permissions*', { fixture: 'shared/create-permissions.json' });
    cy.intercept('/api/v2/internal/organizations/*/grid/permissions', { statusCode: 404, body: {} });
    cy.intercept('/api/v2/internal/organizations/*/grid/*/*', { statusCode: 404, body: {} });
    cy.setup(true, 'it-systems/it-system-catalog');
  });

  it('can migrate usage if global admin', () => {
    const connectedDropdown = 'connected-dropdown-selector';
    cy.intercept('/api/v2/internal/it-system-usages/migration/permissions', {
      fixture: './it-system-catalog/migration-permissions.json',
    });
    cy.intercept('api/v2/internal/it-system-usages/migration/unused-it-systems?organizationUuid=**', {
      fixture: './it-system-catalog/it-systems-v2.json',
    });
    cy.intercept('/api/v2/internal/it-system-usages/search*', {
      fixture: './it-system-usage/it-system-usages-v2.json',
    });
    cy.intercept('GET', 'api/v2/internal/it-system-usages/*/migration?*', {
      fixture: './it-system-catalog/migration.json',
    });
    cy.intercept('POST', 'api/v2/internal/it-system-usages/*/migration?*', {
      fixture: '',
    }).as('executeMigration');

    cy.getByDataCy('grid-usages-link').first().click();
    cy.getByDataCy('migrate-button').first().click();
    cy.getByDataCy(connectedDropdown).type('System 2');
    cy.dropdownByCy(connectedDropdown, 'System 2', true);
    cy.getByDataCy('confirm-button').click();
    cy.getByDataCy('execute-migration-button').click();

    const system2Uuid = 'ede11fff-cf8d-4fb4-8b89-d8822cce64b0';
    cy.wait('@executeMigration').then((interception) => {
      expect(interception.request.query['toSystemUuid']).to.equal(system2Uuid);
    });
  });

  it('can show IT system usage grid', () => {
    cy.get('h3').should('have.text', 'IT Systemkatalog');

    cy.contains('System 1');
    cy.contains('System 2');
  });

  it('cant create if name already exists', () => {
    cy.intercept('/api/v2/internal/it-systems/search*', {
      fixture: './it-system-catalog/it-systems-v2.json',
    });
    cy.getByDataCy('create-button').click();
    cy.inputByCy('create-name').type('System 1');
    // The name field waits for 500ms before calling the backend to verify if the name already exists
    cy.wait(500);
    cy.getByDataCy('name-error').should('exist');
  });
});
