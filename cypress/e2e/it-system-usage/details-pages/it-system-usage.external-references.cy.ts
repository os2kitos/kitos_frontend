/// <reference types="Cypress" />

describe('it-system-usage', () => {
  const itSystemUsageBaseUrl = '/api/v2/it-system-usages/*';
  beforeEach(() => {
    cy.requireIntercept();
    cy.intercept('/odata/ItSystemUsageOverviewReadModels*', { fixture: './it-system-usage/it-system-usages.json' });
    cy.intercept('/api/v2/it-system-usages/*', { fixture: './it-system-usage/it-system-usage.json' });
    cy.intercept('/api/v2/it-system-usage-data-classification-types*', {
      fixture: './it-system-usage/classification-types.json',
    });
    cy.intercept('/api/v2/it-system-usages/*/permissions', { fixture: './shared/permissions.json' });
    cy.intercept('/api/v2/it-systems/*', { fixture: 'it-system.json' }); //gets the base system
    cy.setup(true, 'it-systems/it-system-usages');
  });

  it('can show external references', () => {
    cy.contains('System 3').click();

    cy.navigateToDetailsSubPage('Lokale referencer');

    cy.testCanShowExternalRefernces();
  });

  it('can show no external references', () => {
    cy.intercept('/api/v2/it-system-usages/*', {
      fixture: './it-system-usage/external-references/it-system-usage-no-external-references.json',
    });

    cy.contains('System 3').click();
    cy.navigateToDetailsSubPage('Lokale referencer');

    cy.contains('Der er endnu ikke tilføjet referencer');
    cy.contains('Opret reference');
  });

  it('can add external reference and override master reference', () => {
    cy.contains('System 3').click();
    cy.navigateToDetailsSubPage('Lokale referencer');

    cy.externalReferencesSaveAndValidate(
      false,
      true,
      false,
      itSystemUsageBaseUrl,
      './it-system-usage/external-references/it-system-usage-with-extra-external-reference.json'
    );
  });

  it('can add external reference with required master reference, when no reference is present', () => {
    cy.intercept('/api/v2/it-system-usages/*', {
      fixture: './it-system-usage/external-references/it-system-usage-no-external-references.json',
    });

    cy.contains('System 3').click();
    cy.navigateToDetailsSubPage('Lokale referencer');

    cy.externalReferencesSaveAndValidate(
      true,
      false,
      false,
      itSystemUsageBaseUrl,
      './it-system-usage/external-references/it-system-usage-with-extra-external-reference.json'
    );
  });

  it('can modify external reference, and assign new Master reference', () => {
    cy.contains('System 3').click();
    cy.navigateToDetailsSubPage('Lokale referencer');

    cy.externalReferencesSaveAndValidate(
      false,
      true,
      true,
      itSystemUsageBaseUrl,
      './it-system-usage/external-references/it-system-usage-with-edited-external-reference.json',
      'Valid url'
    );
  });

  it('can modify external reference master reference', () => {
    cy.contains('System 3').click();
    cy.navigateToDetailsSubPage('Lokale referencer');

    cy.externalReferencesSaveAndValidate(
      true,
      false,
      true,
      itSystemUsageBaseUrl,
      './it-system-usage/external-references/it-system-usage-modified-master-reference.json',
      'No url Master reference'
    );
  });

  it('can delete non master external reference', () => {
    cy.contains('System 3').click();
    cy.navigateToDetailsSubPage('Lokale referencer');

    const referenceTitleToRemove = 'Valid url';

    cy.getRowForElementContent(referenceTitleToRemove)
      .first()
      .within(() => cy.get('app-trashcan-icon').click({ force: true }));

    cy.verifyYesNoConfirmationDialogAndConfirm(
      'PATCH',
      '/api/v2/it-system-usages/*',
      { fixture: './it-system-usage/external-references/it-system-usage-external-references-removed-item.json' },
      'Er du sikker på at du vil fjerne referencen?'
    );
    cy.contains('Referencen blev slettet');

    cy.contains(referenceTitleToRemove).should('not.exist');
  });

  it('can not delete master external reference', () => {
    cy.contains('System 3').click();
    cy.navigateToDetailsSubPage('Lokale referencer');

    cy.getRowForElementContent('No url Master reference')
      .first()
      .within(() => cy.get('app-trashcan-icon').should('not.exist'));
  });
});
