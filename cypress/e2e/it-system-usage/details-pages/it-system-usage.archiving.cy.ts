describe('it-system-usage', () => {
  beforeEach(() => {
    cy.requireIntercept();
    cy.intercept('/odata/ItSystemUsageOverviewReadModels*', { fixture: './it-system-usage/it-system-usages.json' });
    cy.intercept('/api/v2/it-system-usage-data-classification-types*', {
      fixture: './it-system-usage/classification-types.json',
    });
    cy.intercept('/api/v2/it-system-usages/*/permissions', { fixture: './shared/permissions.json' });
    cy.intercept('/api/v2/it-systems/*', { fixture: 'it-system.json' }); //gets the base system
    cy.setup(true, 'it-systems/it-system-usages');

    cy.intercept('/api/v2/organization*', { fixture: './organizations/organizations-multiple.json' });
    cy.intercept('/api/v2/it-system-usage-archive-types*', {
      fixture: './it-system-usage/archiving/it-system-usage-archive-types.json',
    });
    cy.intercept('/api/v2/it-system-usage-archive-location-types*', {
      fixture: './it-system-usage/archiving/it-system-usage-archive-location-types.json',
    });
    cy.intercept('/api/v2/it-system-usage-archive-test-location-types*', {
      fixture: './it-system-usage/archiving/it-system-usage-archive-test-location-types.json',
    });
  });

  it('fields are disabled if archiveDuty is not selected ', () => {
    cy.intercept('/api/v2/it-system-usages/*', {
      fixture: './it-system-usage/archiving/it-system-usage-no-archiving.json',
    });
    openArchiveTab();

    verifyFieldsHaveCorrectState(true);

    cy.intercept('PATCH', '/api/v2/it-system-usages/*', {
      fixture: './it-system-usage/archiving/it-system-usage-archiving-duty-only.json',
    });
    cy.dropdown('Arkiveringspligt', 'K', true);

    verifyFieldsHaveCorrectState(false);
  });

  it('can modify archiving data', () => {
    cy.intercept('/api/v2/it-system-usages/*', { fixture: './it-system-usage/it-system-usage' });
    openArchiveTab();

    cy.intercept('PATCH', '/api/v2/it-system-usages/*', { fixture: './it-system-usage/it-system-usage.json' }).as(
      'patch'
    );

    cy.dropdown('Arkiveringspligt', 'K', true);
    verifyArchivePatchRequest({ archiveDuty: 'K' });

    cy.contains('Feltet er opdateret');

    cy.dropdown('Arkivtype', 'Other type', true);
    verifyArchivePatchRequest({ typeUuid: 'aaad266c-3b84-49a0-8dc4-9d57b5dbc26b' });

    cy.dropdown('Arkiveringssted', 'Other location', true);
    verifyArchivePatchRequest({ locationUuid: 'abc3266c-3b84-49a0-8dc4-9d57b5dbc26b' });

    cy.dropdown('Arkiveringsleverandør', 'Organisation 2', true);
    verifyArchivePatchRequest({ supplierOrganizationUuid: '4dc52c64-3706-40f4-bf58-45035bb376da' });

    cy.dropdown('Arkiveringsteststed', 'Other test location', true);
    verifyArchivePatchRequest({ testLocationUuid: 'agd3266c-3b84-49a0-8dc4-9d57b5dbc26b' });

    cy.input('Arkiveringsfrekvens (antal år)').clear().type('2');
    cy.contains('Arkiveringsbemærkninger').click();
    verifyArchivePatchRequest({ frequencyInMonths: 2 });

    cy.get('textarea').clear().type('new description');
    cy.input('Arkiveringsfrekvens (antal år)').click();
    verifyArchivePatchRequest({ notes: 'new description' });

    cy.input('Dokumentbærende').uncheck();
    verifyArchivePatchRequest({ documentBearing: false });

    cy.input('Nej').click();
    verifyArchivePatchRequest({ active: false });
  });

  it('can add journal period', () => {
    cy.intercept('/api/v2/it-system-usages/*', {
      fixture: './it-system-usage/archiving/it-system-usage-no-journal-periods.json',
    });
    openArchiveTab();

    cy.contains('Tilføj journalperiode').click();

    cy.intercept('**journal-periods', {});
    inputJournalDataAndValidate(true, false);
  });

  it('can edit journal period', () => {
    cy.intercept('/api/v2/it-system-usages/*', {
      fixture: './it-system-usage/archiving/it-system-usage-with-journal-period.json',
    });
    openArchiveTab();

    cy.get('app-pencil-icon').first().click({ force: true });

    cy.intercept('**/journal-periods/**', {});
    inputJournalDataAndValidate(false, true);
  });

  it('can delete journal period', () => {
    cy.intercept('/api/v2/it-system-usages/*', { fixture: './it-system-usage/it-system-usage.json' });
    openArchiveTab();

    cy.get('app-trashcan-icon').first().click({ force: true });
    cy.verifyYesNoConfirmationDialogAndConfirm(
      'DELETE',
      '**/journal-periods/**',
      {},
      'Er du sikker på at du vil fjerne denne journalperiode?'
    );
  });
});

function openArchiveTab() {
  cy.contains('System 3').click();

  cy.navigateToDetailsSubPage('Arkivering');
}

function inputJournalDataAndValidate(shouldBeActive: boolean, isEdit: boolean) {
  //If the intercepts are not separate the test won't work
  //I don't see a reason why that is the case
  cy.intercept('/api/v2/it-system-usages*', {});

  const newJournalPeriod = {
    startDate: '2023-12-31',
    endDate: '2049-12-31',
    archiveId: '123',
  };

  cy.get('app-it-system-usage-details-journal-period-write-dialog').within(() => {
    cy.input('Startdato').type(newJournalPeriod.startDate);
    cy.input('Slutdato').type(newJournalPeriod.endDate);
    cy.clearInputText('Unikt arkiv-id').type(newJournalPeriod.archiveId);

    if (shouldBeActive) {
      cy.get('mat-checkbox input').check().should('be.checked');
    } else {
      cy.get('mat-checkbox input').uncheck().should('be.empty');
    }

    cy.contains(isEdit ? 'Gem' : 'Opret').click();
  });

  cy.get('app-popup-message').should('exist');
}

function verifyFieldsHaveCorrectState(shouldBeDisabled: boolean) {
  cy.contains('Læs mere hos Rigsarkivet');

  const disableOrEnableText = shouldBeDisabled ? 'be.disabled' : 'be.enabled';

  cy.input('Arkivtype').should(disableOrEnableText);
  cy.input('Arkiveringssted').should(disableOrEnableText);

  cy.input('Arkiveringsleverandør').should(disableOrEnableText);
  cy.input('Arkiveringsteststed').should(disableOrEnableText);

  cy.input('Arkiveringsfrekvens (antal år)').should(disableOrEnableText);
  cy.contains('Dokumentbærende').parent().find('input').should(disableOrEnableText);
  cy.contains('Er der arkiveret fra systemet?').parent().find('input').should(disableOrEnableText);
  cy.get('textarea').should(disableOrEnableText);

  cy.contains('Tilføj journalperiode').should(shouldBeDisabled ? 'not.exist' : 'exist');
}

function verifyArchivePatchRequest(archiveUpdate: object) {
  cy.verifyRequestUsingDeepEq('patch', 'request.body', { archiving: archiveUpdate });
}
