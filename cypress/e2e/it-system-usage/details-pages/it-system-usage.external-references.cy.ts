/// <reference types="cypress" />

import { TestRunner } from 'cypress/support/test-runner';

function setupTest() {
  cy.requireIntercept();
  cy.setupItSystemUsageIntercepts();
  cy.setup(true, 'it-systems/it-system-usages');
}

describe('it-system-usage references', () => {
  const itSystemUsageBaseUrl = '/api/v2/it-system-usages/*';
  const refsBaseUrl = '/api/v2/internal/external-references/it-system-usages/*';

  const testRunner = new TestRunner(setupTest);

  it('Tests', () => {
    testRunner.runTestWithSetup('can show external references', () => {
      cy.contains('System 3').click();

      cy.intercept(refsBaseUrl, {
        fixture: './it-system-usage/external-references/normal-external-references.json',
      });

      cy.navigateToDetailsSubPage('Lokale referencer');

      cy.testCanShowExternalReferences();
    });

    testRunner.runTestWithSetup('can show no external references', () => {
      cy.intercept(refsBaseUrl, {
        fixture: './it-system-usage/external-references/no-external-references.json',
      });

      cy.contains('System 3').click();
      cy.navigateToDetailsSubPage('Lokale referencer');

      cy.contains('Der er endnu ikke tilføjet referencer');
      cy.contains('Opret reference');
    });

    testRunner.runTestWithSetup('can add external reference and override master reference', () => {
      cy.intercept(refsBaseUrl, {
        fixture: './it-system-usage/external-references/normal-external-references.json',
      });
      cy.contains('System 3').click();
      cy.navigateToDetailsSubPage('Lokale referencer');

      cy.intercept(refsBaseUrl, {
        fixture: './it-system-usage/external-references/extra-external-references.json',
      });

      cy.externalReferencesSaveAndValidate(
        false,
        true,
        false,
        itSystemUsageBaseUrl,
        './it-system-usage/external-references/it-system-usage.json'
      );
    });

    testRunner.runTestWithSetup(
      'can add external reference with required master reference, when no reference is present',
      () => {
        cy.intercept(refsBaseUrl, {
          fixture: './it-system-usage/external-references/no-external-references.json',
        });

        cy.contains('System 3').click();
        cy.navigateToDetailsSubPage('Lokale referencer');

        cy.intercept(refsBaseUrl, {
          fixture: './it-system-usage/external-references/extra-external-references.json',
        });

        cy.externalReferencesSaveAndValidate(
          true,
          false,
          false,
          itSystemUsageBaseUrl,
          './it-system-usage/external-references/it-system-usage.json'
        );
      }
    );

    testRunner.runTestWithSetup('can modify external reference, and assign new Master reference', () => {
      cy.intercept(refsBaseUrl, {
        fixture: './it-system-usage/external-references/normal-external-references.json',
      });

      cy.contains('System 3').click();
      cy.navigateToDetailsSubPage('Lokale referencer');

      cy.intercept(refsBaseUrl, {
        fixture: './it-system-usage/external-references/edited-external-references.json',
      });

      cy.externalReferencesSaveAndValidate(
        false,
        true,
        true,
        itSystemUsageBaseUrl,
        './it-system-usage/external-references/it-system-usage.json',
        'Valid url'
      );
    });

    testRunner.runTestWithSetup('can modify external reference master reference', () => {});
    cy.intercept(refsBaseUrl, {
      fixture: './it-system-usage/external-references/normal-external-references.json',
    });

    cy.contains('System 3').click();
    cy.navigateToDetailsSubPage('Lokale referencer');

    cy.intercept(refsBaseUrl, {
      fixture: './it-system-usage/external-references/modified-master-external-references.json',
    });

    cy.externalReferencesSaveAndValidate(
      false,
      false,
      true,
      itSystemUsageBaseUrl,
      './it-system-usage/external-references/it-system-usage.json',
      'No url Master reference'
    );

    testRunner.runTestWithSetup('can delete non master external reference', () => {
      cy.intercept(refsBaseUrl, {
        fixture: './it-system-usage/external-references/normal-external-references.json',
      });

      cy.contains('System 3').click();
      cy.navigateToDetailsSubPage('Lokale referencer');

      const referenceTitleToRemove = 'Valid url';

      cy.getRowForElementContent(referenceTitleToRemove)
        .first()
        .within(() => cy.get('app-trashcan-icon').click({ force: true }));

      cy.intercept(refsBaseUrl, {
        fixture: './it-system-usage/external-references/external-references-removed-item.json',
      });

      cy.verifyYesNoConfirmationDialogAndConfirm(
        'PATCH',
        '/api/v2/it-system-usages/*',
        { fixture: './it-system-usage/external-references/it-system-usage.json' },
        'Er du sikker på at du vil fjerne referencen?'
      );
      cy.contains('Referencen blev slettet');

      cy.contains(referenceTitleToRemove).should('not.exist');
    });
  });
});
