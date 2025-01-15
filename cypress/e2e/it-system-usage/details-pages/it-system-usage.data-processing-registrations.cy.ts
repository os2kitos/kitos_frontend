/// <reference types="Cypress" />

describe('it-system-usage', () => {
  beforeEach(() => {
    cy.requireIntercept();
    cy.setupItSystemUsageIntercepts();
    cy.setup(true, 'it-systems/it-system-usages');
  });

  it('can show DPR tab when no associated dprs', () => {
    cy.contains('System 3').click();

    cy.intercept('/api/v2/data-processing-registrations*', []);

    cy.navigateToDetailsSubPage('Databehandling');

    cy.contains('Systemet er ikke omfattet af registreringer i modulet "Databehandling"');
  });

  it('can show DPR with two, known associated dprs', () => {
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
        .contains(row.valid ? 'Aktiv' : 'Inaktiv');
    });
  });
});
