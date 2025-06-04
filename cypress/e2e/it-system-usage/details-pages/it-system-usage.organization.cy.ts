import { TestRunner } from 'cypress/support/test-runner';

function setupTest() {
  cy.requireIntercept();
  cy.setupItSystemUsageIntercepts();
  cy.setup(true, 'it-systems/it-system-usages');
}

describe('it-system-usage organization', () => {
  const testRunner = new TestRunner(setupTest);

  it('it-system-usage organization', () => {
    testRunner.runTestWithSetup('can add Used units by search', () => {
      cy.intercept('/api/v2/it-system-usages/*', { fixture: './it-system-usage/it-system-usage-no-organization.json' });

      cy.contains('System 3').click();

      cy.navigateToDetailsSubPage('Organisation');

      cy.intercept('/api/v2/organizations/*/organization-units*', {
        fixture: './organizations/organization-units-hierarchy.json',
      });

      cy.dropdownByCy('org-unit-select', 'Test - 1', true);

      cy.get('app-popup-message').should('exist');
    });

    testRunner.runTestWithSetup('can restrict number of levels', () => {
      cy.intercept('/api/v2/it-system-usages/*', { fixture: './it-system-usage/it-system-usage-no-organization.json' });

      cy.contains('System 3').click();

      cy.navigateToDetailsSubPage('Organisation');

      cy.intercept('/api/v2/organizations/*/organization-units*', {
        fixture: './organizations/organization-units-hierarchy.json',
      });

      cy.inputByCy('levels-input').type('1');

      cy.contains('Test - 1').should('not.exist');
    });

    testRunner.runTestWithSetup('can show Used units', () => {
      cy.intercept('/api/v2/it-system-usages/*', { fixture: './it-system-usage/it-system-usage.json' });

      cy.contains('System 3').click();

      cy.navigateToDetailsSubPage('Organisation');

      const expectedRows = [
        { uuid: '803fd406-27e2-4785-b162-02ee6ea876d1', name: 'Direktørområde' },
        { uuid: 'f4db9743-41e3-4a7a-ad62-683d10abe418', name: 'Test - 1' },
        { uuid: '933765a9-dad5-4a22-8d71-55b6798a094c', name: 'Test' },
      ];

      for (const expectedRow of expectedRows) {
        cy.contains(expectedRow.name);
      }
    });

    testRunner.runTestWithSetup('can select Responsible unit', () => {
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
});
