import { TestRunner } from 'cypress/support/test-runner';

function setupTest() {
  cy.requireIntercept();
  cy.setupItSystemUsageIntercepts();
  cy.setup(true, 'it-systems/it-system-usages');
}

describe('it-system-usage hierarchy', () => {
  it('Tests', () => {
    const testRunner = new TestRunner(setupTest);

    testRunner.runTestWithSetup('shows complex hierarchy', () => {
      cy.intercept('/api/v2/internal/organization/*/it-systems/*/hierarchy', {
        fixture: './it-system-usage/hierarchy-complex.json',
      });

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
});
