/// <reference types="Cypress" />

describe('it-contracts.deadlines', () => {
  beforeEach(() => {
    cy.requireIntercept();
    cy.setupContractIntercepts();
    cy.setup(true, 'it-contracts');
  });

  it('Duration is reset and disabled when IsContinous is true', () => {
    goToDeadlines();

    cy.inputByCy('deadlines-duration-years').should('have.value', '12');
    cy.inputByCy('deadlines-duration-months').should('have.value', '5');

    cy.intercept('PATCH', '/api/v2/it-contracts/*', {
      fixture: './it-contracts/deadlines/it-contract-with-continous-true.json',
    });
    cy.getByDataCy('deadlines-is-continous').find('input').check();

    cy.getByDataCy('deadlines-duration-years').find('mat-form-field').should('have.class', 'mat-form-field-disabled');
    cy.getByDataCy('deadlines-duration-months').find('mat-form-field').should('have.class', 'mat-form-field-disabled');
  });
});

function goToDeadlines() {
  cy.contains('Contract 1').click();
  cy.navigateToDetailsSubPage('Aftalefrister');
}
