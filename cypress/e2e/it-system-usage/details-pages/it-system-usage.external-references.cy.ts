/// <reference types="Cypress" />

import { verifyArrayContainsObject } from 'cypress/support/request-verification';

describe('it-system-usage', () => {
  beforeEach(() => {
    cy.requireIntercept();
    cy.intercept('/odata/ItSystemUsageOverviewReadModels*', { fixture: 'it-system-usages.json' });
    cy.intercept('/api/v2/it-system-usages/*', { fixture: 'it-system-usage.json' });
    cy.intercept('/api/v2/it-system-usage-data-classification-types*', { fixture: 'classification-types.json' });
    cy.intercept('/api/v2/it-system-usages/*/permissions', { fixture: 'permissions.json' });
    cy.intercept('/api/v2/it-systems/*', { fixture: 'it-system.json' }); //gets the base system
    cy.setup(true, 'it-systems/it-system-usages');
  });

  it('can show external references', () => {
    cy.contains('System 3').click();

    cy.navigateToDetailsSubPage('Lokale referencer');

    const expectedRows = [
      {
        title: 'Invalid url',
        documentId: 'document1',
        expectedInvalidUrl: 'www.google.com',
        masterReference: false,
      },
      {
        title: 'Valid url',
        documentId: 'document2',
        expectedValidUrl: 'https://www.google.com',
        masterReference: false,
      },
      {
        title: 'No url Master reference',
        documentId: 'document3',
        url: '',
        masterReference: true,
      },
    ];

    expectedRows.forEach((expectedRow) => {
      const row = () => cy.getRowForElementContent(expectedRow.title);
      row().contains(expectedRow.documentId);
      row().contains(expectedRow.masterReference ? 'Ja' : 'Nej');
      if (expectedRow.expectedInvalidUrl) {
        row().verifyTooltipText('Ugyldigt link: ' + expectedRow.expectedInvalidUrl);
      }
      if (expectedRow.expectedValidUrl) {
        row().verifyExternalReferenceHrefValue(expectedRow.title, expectedRow.expectedValidUrl);
      }
    });
  });

  it('can show no external references', () => {
    cy.intercept('/api/v2/it-system-usages/*', {
      fixture: './external-references/it-system-usage-no-external-references.json',
    });

    cy.contains('System 3').click();
    cy.navigateToDetailsSubPage('Lokale referencer');

    cy.contains('Der er endnu ikke tilføjet referencer');
    cy.contains('Opret reference');
  });

  it('can add external reference and override master reference', () => {
    cy.contains('System 3').click();
    cy.navigateToDetailsSubPage('Lokale referencer');

    openCreateDialog();
    inputReferenceDataSaveAndValidate(
      false,
      true,
      false,
      './external-references/it-system-usage-with-extra-external-reference.json'
    );
  });

  it('can add external reference with required master reference, when no reference is present', () => {
    cy.intercept('/api/v2/it-system-usages/*', {
      fixture: './external-references/it-system-usage-no-external-references.json',
    });

    cy.contains('System 3').click();
    cy.navigateToDetailsSubPage('Lokale referencer');

    openCreateDialog();
    inputReferenceDataSaveAndValidate(
      true,
      false,
      false,
      './external-references/it-system-usage-with-extra-external-reference.json'
    );
  });

  it('can modify external reference, and assign new Master reference', () => {
    cy.contains('System 3').click();
    cy.navigateToDetailsSubPage('Lokale referencer');

    openEditDialog('Valid url');
    inputReferenceDataSaveAndValidate(
      false,
      true,
      true,
      './external-references/it-system-usage-with-edited-external-reference.json'
    );
  });

  it('can modify external reference master reference', () => {
    cy.contains('System 3').click();
    cy.navigateToDetailsSubPage('Lokale referencer');

    openEditDialog('No url Master reference');
    inputReferenceDataSaveAndValidate(
      true,
      false,
      true,
      './external-references/it-system-usage-modified-master-reference.json'
    );
  });

  it('can delete non master external reference', () => {
    cy.contains('System 3').click();
    cy.navigateToDetailsSubPage('Lokale referencer');

    const referenceTitleToRemove = 'Valid url';

    cy.getRowForElementContent(referenceTitleToRemove)
      .first()
      .within(() => cy.get('app-trashcan-icon').click({ force: true }));

    cy.get('app-confirmation-dialog').within(() => {
      cy.contains('Bekræft handling');
      cy.contains('Er du sikker på at du vil fjerne referencen?');

      cy.contains('Nej');

      cy.intercept('PATCH', '/api/v2/it-system-usages/*', {
        fixture: './external-references/it-system-usage-external-references-removed-item.json',
      });
      cy.contains('Ja').click();
    });
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

  function openCreateDialog() {
    cy.contains('Opret reference').click();
  }

  function openEditDialog(title: string) {
    cy.getRowForElementContent(title)
      .first()
      .within(() => cy.get('app-pencil-icon').click({ force: true }));
  }

  function inputReferenceDataSaveAndValidate(
    shouldMasterDataBeDisabled: boolean,
    shouldSelectMasterData: boolean,
    isEdit: boolean,
    responseBodyPath: string
  ) {
    cy.intercept('PATCH', '/api/v2/it-system-usages/*', {
      fixture: responseBodyPath,
    }).as('patchRequest');

    const newReference = {
      title: 'Reference1',
      documentId: 'Document id',
      url: 'url',
      masterReference: true,
    };

    cy.get('app-external-reference-dialog').within(() => {
      cy.contains('Titel').parent().clear().type(newReference.title);
      cy.contains('Evt. DokumentID/sagsnr./Anden Reference')
        .parent()
        .type('{selectAll}{backspace}')
        .type(newReference.documentId);
      cy.contains('URL, hvis dokumenttitel skal virke som link')
        .parent()
        .type('{selectAll}{backspace}')
        .type(newReference.url);

      if (shouldMasterDataBeDisabled) {
        cy.get('mat-checkbox input').should('be.checked').should('be.disabled');
      } else {
        cy.get('mat-checkbox input').should('be.empty').should('be.enabled');
      }
      if (shouldSelectMasterData) {
        cy.get('mat-checkbox').should('have.text', 'Vises i overblik').click();
      }

      cy.contains('Gem').click();
    });

    if (isEdit) {
      cy.contains('Referencen blev ændret');
    } else {
      cy.contains('Referencen blev oprettet');
    }

    cy.wait('@patchRequest')
      .its('request.body.externalReferences')
      .then((actual) => {
        expect(
          verifyArrayContainsObject(actual, {
            title: 'Reference1',
            documentId: 'Document id',
            url: 'url',
            masterReference: true,
          })
        ).to.be.true;
      });

    cy.getRowForElementContent(newReference.title)
      .first()
      .within(() => {
        cy.contains(newReference.documentId);
        cy.contains('Ja');
        cy.verifyTooltipText('Ugyldigt link: ' + newReference.url);
      });
  }
});
