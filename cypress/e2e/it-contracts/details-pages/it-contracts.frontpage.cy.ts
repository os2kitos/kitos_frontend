/// <reference types="Cypress" />

describe('it-contracts.frontpage', () => {
  beforeEach(() => {
    cy.requireIntercept();
    cy.setupContractIntercepts();
    cy.setup(true, 'it-contracts');
  });

  // 20240820 MHS - Test is flaky and disabled - datepicker problem
  // it('contains all required fields', () => {
  //   cy.contains('Contract 1').click();

  //   //General information
  //   cy.inputByCy('contract-name').clear().type('Newname');
  //   cy.inputByCy('contract-id').clear().type('Newid');
  //   cy.dropdownByCy('contract-type', 'Serviceaftale', true);
  //   cy.dropdownByCy('contract-template', 'K02', true);
  //   cy.dropdownByCy('contract-criticality', 'Kritikalitet 2', true);
  //   cy.dropdownByCy('contract-purchase-type', 'SKI 02.18', true);
  //   cy.getByDataCy('contract-valid-status').find('input').should('have.value', 'Gennemtvunget gyldig');
  //   cy.getByDataCy('contract-force-validity').find('input').uncheck();
  //   cy.datepickerByCy('contract-valid-from', '15', true);
  //   cy.datepickerByCy('contract-valid-to', '16', true);
  //   cy.textareaByCy('contract-notes').clear().type('New description');

  //   //Responsible
  //   cy.dropdownByCy('contract-responsible', 'Test - 1', true);
  //   cy.dropdownByCy('contract-responsible-signer', 'Automatisk oprettet testbruger (LocalAdmin)', true);
  //   cy.datepickerByCy('contract-responsible-date', '15', true);
  //   cy.getByDataCy('contract-responsible-signed').find('input').uncheck();

  //   //Supplier
  //   cy.dropdownByCy('contract-supplier', 'Fælles Kommune', true);
  //   cy.inputByCy('contract-supplier-signer').clear().type('New supplier');
  //   cy.datepickerByCy('contract-supplier-date', '15', true);
  //   cy.getByDataCy('contract-supplier-signed').find('input').uncheck({ force: true });

  //   //Procurement
  //   cy.dropdownByCy('contract-procurement-strategy', 'Udbud', true);
  //   cy.dropdownByCy('contract-procurement-plan', 'Q4', true);
  //   cy.getByDataCy('contract-procurement-initiated').should('exist');

  //   //History
  //   cy.getByDataCy('contract-created-by')
  //     .find('input')
  //     .should('have.value', 'Automatisk oprettet testbruger (Api GlobalAdmin)');
  //   cy.getByDataCy('contract-modified-by')
  //     .find('input')
  //     .should('have.value', 'Automatisk oprettet testbruger (GlobalAdmin)');
  //   cy.getByDataCy('contract-modified').find('input').should('have.value', '03-04-2024');
  // });

  it('can select parent contract', () => {
    cy.contains('Contract 1').click();

    cy.dropdownByCy('parent-contract', 'The valid contract', true);
    cy.get('app-popup-message').should('exist');
  });
});
