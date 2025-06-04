import { TestRunner } from 'cypress/support/test-runner';

function setupTest() {
  cy.requireIntercept();
  cy.setupItSystemUsageIntercepts();
  cy.setup(true, 'it-systems/it-system-usages');
}

describe('it-system-usage dpr', () => {
  it('Tests', () => {
    const testRunner = new TestRunner(setupTest);

    testRunner.runTestWithSetup('can show DPR tab when no associated dprs', () => {
      cy.contains('System 3').click();

      cy.intercept('/api/v2/data-processing-registrations*', []);

      cy.navigateToDetailsSubPage('Databehandling');

      cy.contains('Systemet er ikke omfattet af registreringer i modulet "Databehandling"');
    });

    testRunner.runTestWithSetup('can show DPR with two, known associated dprs', () => {
      cy.contains('System 3').click();

      cy.intercept('/api/v2/data-processing-registrations*', {
        fixture: './dpr/it-system-usage-data-processing-registrations.json',
      });

      cy.navigateToDetailsSubPage('Databehandling');

      const expectedRows = [
        {
          name: 'DPA 1 - INVALID',
          valid: false,
        },
        {
          name: 'DPA 2 - VALID',
          valid: true,
        },
      ];

      cy.get('tr').should('have.length', expectedRows.length);
      expectedRows.forEach((row) => {
        const rowElement = cy.contains(row.name);
        rowElement
          .parentsUntil('tr')
          .parent()
          .contains(row.valid ? 'Aktiv' : 'Ikke aktiv');
      });
    });
  });
});
