/// <reference types="Cypress" />

describe('it-contracts.external-references', () => {
  const itContractBaseUrl = '/api/v2/it-contracts/*';
  beforeEach(() => {
    cy.requireIntercept();
    cy.setupContractIntercepts();
    cy.setup(true, 'it-contracts');
  });

  it('can show external references', () => {
    cy.intercept('/api/v2/it-contracts/*', {
      fixture: './it-contracts/it-contract-with-extra-external-reference.json',
    });
    cy.contains('Contract 1').click();

    cy.navigateToDetailsSubPage('Referencer');

    cy.testCanShowExternalReferences();
  });

  it('can show no external references', () => {
    cy.contains('Contract').click();
    cy.navigateToDetailsSubPage('Referencer');

    cy.contains('Der er endnu ikke tilføjet referencer');
    cy.contains('Opret reference');
  });

  it('can add external reference with required master reference, when no reference is present', () => {
    cy.contains('Contract 1').click();
    cy.navigateToDetailsSubPage('Referencer');

    cy.externalReferencesSaveAndValidate(
      true,
      false,
      false,
      itContractBaseUrl,
      './it-contracts/it-contract-with-edited-extra-external-reference.json'
    );
  });

  it('can modify external reference, and assign new Master reference', () => {
    cy.intercept('/api/v2/it-contracts/*', {
      fixture: './it-contracts/it-contract-with-extra-external-reference.json',
    });
    cy.contains('Contract 1').click();
    cy.navigateToDetailsSubPage('Referencer');

    cy.externalReferencesSaveAndValidate(
      false,
      true,
      true,
      itContractBaseUrl,
      './it-contracts/it-contract-with-edited-extra-external-reference.json',
      'Valid url'
    );
  });

  it('can not delete master external reference', () => {
    cy.intercept('/api/v2/it-contracts/*', {
      fixture: './it-contracts/it-contract-with-extra-external-reference.json',
    });
    cy.contains('Contract 1').click();
    cy.navigateToDetailsSubPage('Referencer');

    cy.getRowForElementContent('No url Master reference')
      .first()
      .within(() => cy.get('app-trashcan-icon').should('not.exist'));
  });
});
