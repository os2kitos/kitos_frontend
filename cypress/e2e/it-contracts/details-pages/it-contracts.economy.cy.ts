/// <reference types="Cypress" />

describe('it-contracts.economy', () => {
  beforeEach(() => {
    cy.requireIntercept();
    cy.setupContractIntercepts();
    cy.setup(true, 'it-contracts');
  });

  it('Organization unit is required', () => {
    goToEconomy();

    cy.getByDataCy('add-payment-button').first().click();

    cy.get('app-dialog').within(() => {
      cy.getByDataCy('confirm-button').find('button').should('be.disabled');
      cy.dropdownByCy('organization-unit-dropdown', 'Test_28_11_2018', true);
      cy.getByDataCy('confirm-button').find('button').should('be.enabled');
    });
  });
});

function goToEconomy() {
  cy.contains('Contract 1').click();
  cy.navigateToDetailsSubPage('Økonomi');
}
