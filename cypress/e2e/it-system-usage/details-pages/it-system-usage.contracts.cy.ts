/// <reference types="Cypress" />

describe('it-system-usage', () => {
  beforeEach(() => {
    cy.requireIntercept();
    cy.setupItSystemUsageIntercepts();
    cy.setup(true, 'it-systems/it-system-usages');
  });

  it('can show Contracts tab when no associated contracts', () => {
    cy.contains('System 3').click();

    cy.intercept('/api/v2/it-contract-contract-types*', { fixture: './shared/contract-types.json' });
    cy.intercept('/api/v2/it-contracts*', []);

    cy.navigateToDetailsSubPage('Kontrakter');

    cy.contains('Systemet er ikke omfattet af registreringer i modulet "IT Kontrakter"');
  });

  it('can show Contracts tab associated contracts and no main contract selected', () => {
    cy.intercept('/api/v2/it-system-usages/*', { fixture: './it-system-usage/it-system-usage-no-main-contract.json' });

    cy.contains('System 3').click();

    cy.intercept('/api/v2/it-contract-contract-types*', { fixture: './shared/contract-types.json' });
    cy.intercept('/api/v2/it-contracts*', { fixture: './it-contracts/it-contracts-by-it-system-usage-uuid.json' });

    cy.navigateToDetailsSubPage('Kontrakter');

    const expectedRows = [
      {
        name: 'The valid contract',
        valid: true,
        contractType: 'Tillægskontrakt',
        contractTypeObsoleted: false,
        supplier: 'Ballerup kommune',
        operation: 'Nej',
        validFrom: '28-02-2023',
        validTo: '09-04-2023',
        terminated: '10-06-2023',
      },
      {
        name: 'The invalid contract',
        valid: false,
        contractType: 'Expected obsoleted contract type',
        contractTypeObsoleted: true,
        supplier: 'Fælles Kommune',
        operation: 'Ja',
        validFrom: '02-01-2023',
        validTo: '27-02-2023',
      },
    ];

    cy.getCardWithTitle('Kontrakt der gør systemet aktivt').contains('Vælg kontrakt');

    cy.getCardWithTitle('Tilknyttede kontrakter').within(() => {
      for (const expectedRow of expectedRows) {
        const row = () => cy.getRowForElementContent(expectedRow.name);
        row().contains(expectedRow.name);
        row()
          .get(expectedRow.operation === 'Ja' ? 'app-check-positive-green-icon' : 'app-check-negative-gray-icon')
          .should('exist');
        row().contains(expectedRow.validFrom);
        row().contains(expectedRow.validTo);
        if (expectedRow.terminated) {
          row().contains(expectedRow.terminated);
        }
        row().contains(expectedRow.valid ? 'Gyldig' : 'Ikke gyldig');
        row().contains(expectedRow.contractType + (expectedRow.contractTypeObsoleted ? ' (udgået)' : ''));
      }
    });
  });

  it('can change selected contract', () => {
    cy.intercept('/api/v2/it-system-usages/*', { fixture: './it-system-usage/it-system-usage-no-main-contract.json' });
    cy.contains('System 3').click();

    cy.intercept('/api/v2/it-contract-contract-types*', { fixture: './shared/contract-types.json' });
    cy.intercept('/api/v2/it-contracts?*', { fixture: './it-contracts/it-contracts-by-it-system-usage-uuid.json' });

    cy.navigateToDetailsSubPage('Kontrakter');

    cy.getCardWithTitle('Kontrakt der gør systemet aktivt').within(() => {
      cy.contains('Vælg kontrakt');

      //Try the valid contract
      cy.intercept('PATCH', '/api/v2/it-system-usages/*', {
        fixture: './it-system-usage/it-system-usage-valid-main-contract.json',
      });
      cy.dropdown('Vælg kontrakt', 'The valid contract', true);
      cy.contains('Gyldig');
      cy.contains('Ikke gyldig').should('not.exist');

      //Try the invalid contract
      cy.intercept('PATCH', '/api/v2/it-system-usages/*', {
        fixture: './it-system-usage/it-system-usage-invalid-main-contract.json',
      });
      cy.dropdown('Vælg kontrakt', 'The invalid contract', true);
      cy.contains('Ikke gyldig');
    });
  });
});
