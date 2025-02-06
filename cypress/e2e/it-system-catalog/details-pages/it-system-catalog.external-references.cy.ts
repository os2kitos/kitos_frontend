/// <reference types="Cypress" />

describe('it-system-catalog', () => {
  const itSystemBaseUrl = '/api/v2/it-systems/*';
  beforeEach(() => {
    cy.requireIntercept();
    cy.setupItSystemCatalogIntercepts();
    cy.setup(true, 'it-systems/it-system-catalog');
  });

  it('can show external references', () => {
    cy.contains('System 3').click();

    cy.navigateToDetailsSubPage('Referencer');

    cy.testCanShowExternalReferences();
  });

  it('can show no external references', () => {
    cy.intercept('/api/v2/it-systems/*', {
      fixture: './it-system-catalog/external-references/it-system-no-external-references.json',
    });

    cy.contains('System 3').click();
    cy.navigateToDetailsSubPage('Referencer');

    cy.contains('Der er endnu ikke tilføjet referencer');
    cy.contains('Opret reference');
  });

  it('can add external reference and override master reference', () => {
    cy.contains('System 3').click();
    cy.navigateToDetailsSubPage('Referencer');

    cy.externalReferencesSaveAndValidate(
      false,
      true,
      false,
      itSystemBaseUrl,
      './it-system-catalog/external-references/it-system-with-extra-external-reference.json'
    );
  });

  it('can add external reference with required master reference, when no reference is present', () => {
    cy.intercept('/api/v2/it-systems/*', {
      fixture: './it-system-catalog/external-references/it-system-no-external-references.json',
    });

    cy.contains('System 3').click();
    cy.navigateToDetailsSubPage('Referencer');

    cy.externalReferencesSaveAndValidate(
      true,
      false,
      false,
      itSystemBaseUrl,
      './it-system-usage/external-references/it-system-usage-with-extra-external-reference.json'
    );
  });

  it('can modify external reference, and assign new Master reference', () => {
    cy.contains('System 3').click();
    cy.navigateToDetailsSubPage('Referencer');

    cy.externalReferencesSaveAndValidate(
      false,
      true,
      true,
      itSystemBaseUrl,
      './it-system-catalog/external-references/it-system-with-edited-external-reference.json',
      'Valid url'
    );
  });

  it('can modify external reference master reference', () => {
    cy.contains('System 3').click();
    cy.navigateToDetailsSubPage('Referencer');

    cy.externalReferencesSaveAndValidate(
      true,
      false,
      true,
      itSystemBaseUrl,
      './it-system-catalog/external-references/it-system-modified-master-reference.json',
      'No url Master reference'
    );
  });

  it('can delete non master external reference', () => {
    cy.contains('System 3').click();
    cy.navigateToDetailsSubPage('Referencer');

    const referenceTitleToRemove = 'Valid url';

    cy.getRowForElementContent(referenceTitleToRemove)
      .first()
      .within(() => cy.get('app-trashcan-icon').click({ force: true }));

    cy.verifyYesNoConfirmationDialogAndConfirm(
      'PATCH',
      '/api/v2/it-systems/*',
      { fixture: './it-system-catalog/external-references/it-system-external-references-removed-item.json' },
      'Er du sikker på at du vil fjerne referencen?'
    );
    cy.contains('Referencen blev slettet');

    cy.contains(referenceTitleToRemove).should('not.exist');
  });

  it('can not delete master external reference', () => {
    cy.contains('System 3').click();
    cy.navigateToDetailsSubPage('Referencer');

    cy.getRowForElementContent('No url Master reference')
      .first()
      .within(() => cy.get('app-trashcan-icon').should('not.exist'));
  });
});
