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
    cy.setup(true, 'it-contracts');
  });

  it('contains all required fields', () => {
    cy.contains('Contract 1').click();

    //General information
    cy.inputByCy('contract-name').clear().type('Newname');
    cy.inputByCy('contract-id').clear().type('Newid');
    cy.dropdownByCy('contract-type', 'Serviceaftale', true);
    cy.dropdownByCy('contract-template', 'K02', true);
    cy.dropdownByCy('contract-criticality', 'Kritikalitet 2', true);
    cy.dropdownByCy('contract-purchase-type', 'SKI 02.18', true);
    cy.getByDataCy('contract-valid-status').find('input').should('have.value', 'Gennemtvunget gyldig');
    cy.getByDataCy('contract-force-validity').find('input').uncheck();
    cy.datepickerByCy('contract-valid-from', '15');
    cy.datepickerByCy('contract-valid-to', '16');
    cy.textareaByCy('contract-notes').clear().type('New description');

    //Responsible
    cy.dropdownByCy('contract-responsible', 'Kitos sekretariatet', true);
    cy.dropdownByCy('contract-responsible-signer', 'Automatisk oprettet testbruger (LocalAdmin)', true);
    cy.datepickerByCy('contract-responsible-date', '15');
    cy.getByDataCy('contract-responsible-signed').find('input').uncheck();

    //Supplier
    cy.dropdownByCy('contract-supplier', 'Fælles Kommune', true);
    cy.inputByCy('contract-supplier-signer').clear().type('New supplier');
    cy.datepickerByCy('contract-supplier-date', '15');
    cy.getByDataCy('contract-supplier-signed').find('input').uncheck();

    //Procurement
    cy.dropdownByCy('contract-procurement-strategy', 'Udbud', true);
    cy.dropdownByCy('contract-procurement-plan', 'Q4', true);
    cy.getByDataCy('contract-procurement-initiated').should('exist');

    //History
    cy.getByDataCy('contract-created-by')
      .find('input')
      .should('have.value', 'Automatisk oprettet testbruger (Api GlobalAdmin)');
    cy.getByDataCy('contract-modified-by')
      .find('input')
      .should('have.value', 'Automatisk oprettet testbruger (GlobalAdmin)');
    cy.getByDataCy('contract-modified').find('input').should('have.value', '03-04-2024');
  });
});
