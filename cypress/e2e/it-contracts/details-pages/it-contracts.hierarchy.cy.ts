/// <reference types="Cypress" />

describe('it-contracts.hierarchy', () => {
  beforeEach(() => {
    cy.requireIntercept();
    cy.setupContractIntercepts();
    cy.setup(true, 'it-contracts');
  });

  it('shows simple hierarchy', () => {
    cy.intercept('/api/v2/internal/it-contracts/*/hierarchy', { fixture: './it-contracts/hierarchy.json' });

    goToHierarchy();

    cy.getByDataCy('contract-hierarchy').within(() => {
      cy.contains('Contract 1');
      cy.contains('Contract 2');
    });
  });

  it('shows complex hierarchy', () => {
    cy.intercept('/api/v2/internal/it-contracts/*/hierarchy', { fixture: './it-contracts/hierarchy-complex.json' });

    goToHierarchy();

    cy.getByDataCy('contract-hierarchy').within(() => {
      cy.contains('Contract 1');
      cy.contains('Contract 2');
      cy.contains('Contract 4');
      cy.contains('Contract 6');
    });
  });
});

function goToHierarchy() {
  cy.contains('Contract 1').click();
  cy.navigateToDetailsSubPage('Hierarki');
}
