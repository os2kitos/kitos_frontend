/// <reference types="Cypress" />

describe('it-contracts', () => {
  beforeEach(() => {
    cy.requireIntercept();
    cy.intercept('/odata/ItContract*', { fixture: './it-contracts/it-contracts.json' });
    cy.intercept('/api/v2/it-contracts/*', { fixture: './it-contracts/it-contract.json' });
    cy.intercept('/api/v2/organizations/*/users', { fixture: './organizations/organization-users.json' });
    cy.intercept('/api/v2/organizations?orderByProperty*', { fixture: './organizations/organizations-multiple.json' });
    cy.intercept('/api/v2/organizations/*/organization-units*', {
      fixture: './organizations/organization-units-hierarchy.json',
    });
    cy.intercept('/api/v2/it-contract-contract-types*', { fixture: './it-contracts/choice-types/contract-types.json' });
    cy.intercept('/api/v2/it-contract-contract-template-types*', {
      fixture: './it-contracts/choice-types/contract-templates.json',
    });
    cy.intercept('/api/v2/it-contract-criticality-types*', {
      fixture: './it-contracts/choice-types/criticality-types.json',
    });
    cy.intercept('/api/v2/it-contract-procurement-strategy-types*', {
      fixture: './it-contracts/choice-types/procurement-strategies.json',
    });
    cy.intercept('/api/v2/it-contract-purchase-types*', { fixture: './it-contracts/choice-types/purchase-types.json' });
    cy.intercept('/api/v2/internal/it-system-usages/relations/*', {
      fixture: './it-contracts/it-contract-system-relations.json',
    });

    cy.setup(true, 'it-contracts');
  });

  it('can create contract dpr', () => {
    goToDpr();
    cy.intercept('api/v2/internal/it-contracts/*/data-processing-registrations', {
      fixture: './it-contracts/it-contract-data-processings.json',
    });

    cy.getByDataCy('add-dpr-button').click();
    cy.get('app-dialog').within(() => {
      cy.dropdownByCy('connected-dropdown-selector', 'DefaultDpa', true);
      cy.getByDataCy('confirm-button').click();
    });
    cy.get('app-popup-messages').should('exist');
  });

  it('can delete contract dpr', () => {
    goToDpr();

    cy.getByDataCy('delete-dpr-button').click();
    cy.verifyYesNoConfirmationDialogAndConfirm('PATCH', '/api/v2/it-contracts/*');
  });
});

function goToDpr() {
  cy.contains('Contract 1').click();
  cy.navigateToDetailsSubPage('Databehandling');
}
