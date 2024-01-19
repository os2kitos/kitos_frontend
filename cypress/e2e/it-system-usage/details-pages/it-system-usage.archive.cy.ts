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

  it('can view Archive tab data', () => {
    cy.intercept('/api/v2/it-system-usages/*', { fixture: './archive/it-system-usage-no-journal-periods.json' });
    openArchiveTab();

    cy.contains('Arkivering');
    cy.dropdown('Arkiveringspligt').should('have.text', 'K');
    cy.contains('Læs mere hos Rigsarkivet');
    cy.dropdown('ArkivType').should('have.text', 'Archive type');
    cy.dropdown('Arkiveringssted').should('have.text', 'Archive location');

    cy.dropdown('Arkiveringsleverandør').should('have.text', 'Organisation 1');
    cy.dropdown('Arkiveringsteststed').should('have.text', 'Archive test location');

    //Include Er der arkiveret fra systemet? radio buttons selection
    cy.input('Arkiveringsfrekvens (antal år)').should('have.value', '30');
    cy.contains('Dokumentbærende').parent().find('input').should('be.checked');
    cy.input('Arkiveringsbemærkninger').type('test description');

    cy.contains('Ingen journalperiode tilføjet endnu');
  });

  it('can input base Archive data', () => {
    cy.intercept('/api/v2/it-system-usages/*', { fixture: './archive/it-system-usage-no-archiving.json' });
    openArchiveTab();

    cy.dropdown('Arkiveringspligt', 'K', true);
    cy.dropdown('ArkivType', 'Archive type', true);
    cy.dropdown('Arkiveringssted', 'Archive location', true);

    cy.dropdown('Arkiveringsleverandør', 'Organisation 1', true);
    cy.dropdown('Arkiveringsteststed', 'Archive test location', true);

    //Include Er der arkiveret fra systemet? radio buttons selection
    cy.input('Arkiveringsfrekvens (antal år)').type('2');
    cy.contains('Dokumentbærende').check().should('have.value', 'true');
    cy.input('Arkiveringsbemærkninger').type('test description');
  });

  it('can add journal period', () => {
    cy.intercept('/api/v2/it-system-usages/*', { fixture: './archive/it-system-usage-no-journal-periods.json' });
    openArchiveTab();

    cy.contains('Opret journalperiod').click();

    inputJournalDataAndValidate(true, false, 'archive/it-system-usage-with-journal-periods.json');
  });

  it('can edit journal period', () => {
    cy.intercept('/api/v2/it-system-usages/*', {
      fixture: './archive/it-system-usage-with-unedited-journal-periods.json',
    });
    openArchiveTab();

    cy.contains('Opret journalperiod').click();

    inputJournalDataAndValidate(true, false, './archive/it-system-usage-with-journal-periods.json');
  });
});

function openArchiveTab() {
  cy.contains('System 3').click();

  cy.intercept('/api/v2/organization*', { fixture: 'organizations-multiple.json' });
  cy.intercept('/api/v2/it-system-usage-archive-types*', { fixture: './archive/it-system-usage-archive-types.json' });
  cy.intercept('/api/v2/it-system-usage-archive-location-types*', {
    fixture: './archive/it-system-usage-archive-location-types.json',
  });
  cy.intercept('/api/v2/it-system-usage-archive-test-location-types*', {
    fixture: './archive/it-system-usage-archive-test-location-types.json',
  });

  cy.navigateToDetailsSubPage('Arkivering');
}

function inputJournalDataAndValidate(shouldApprovedBeDisabled: boolean, isEdit: boolean, responseBodyPath: string) {
  cy.interceptPatch('/api/v2/it-system-usages/*', responseBodyPath, 'patchRequest');

  const newJournalPeriod = {
    startDate: '01-01-2024',
    endDate: '01-01-2050',
    archiveId: '123',
  };

  cy.get('app-archive-dialog').within(() => {
    cy.input('Startdato').type(newJournalPeriod.startDate);
    cy.input('Slutdato').type(newJournalPeriod.endDate);
    cy.clearInputText('Unikt arkiv-id').type(newJournalPeriod.archiveId);

    if (shouldApprovedBeDisabled) {
      cy.get('mat-checkbox input').should('be.checked').should('be.disabled');
    } else {
      cy.get('mat-checkbox input').should('be.empty').should('be.enabled');
    }

    cy.contains('Gem').click();
  });

  if (isEdit) {
    cy.contains('Journalperiod blev ændret');
  } else {
    cy.contains('Journalperiod blev oprettet');
  }

  cy.verifyRequest(
    'patchRequest',
    'request.body.journal-periods',
    (actual, expectedObject) => verifyArrayContainsObject(actual, expectedObject),
    {
      startDate: '01-01-2024',
      endDate: '01-01-2050',
      archiveId: '123',
      approved: shouldApprovedBeDisabled,
    }
  );

  cy.getRowForElementContent(newJournalPeriod.archiveId)
    .first()
    .within(() => {
      cy.contains(newJournalPeriod.startDate);
      cy.contains(newJournalPeriod.endDate);
      cy.contains(shouldApprovedBeDisabled == false ? 'Ja' : 'Nej');
    });
}
