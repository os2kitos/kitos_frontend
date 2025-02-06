/// <reference types="Cypress" />

describe('it-contracts.dpr', () => {
  beforeEach(() => {
    cy.requireIntercept();
    cy.setupContractIntercepts();
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
