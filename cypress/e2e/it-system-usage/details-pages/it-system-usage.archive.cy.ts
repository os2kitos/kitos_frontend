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

  it('Archive tab data depends on Archive Choice selection', () => {
    cy.intercept('/api/v2/it-system-usages/*', { fixture: './archive/it-system-usage-no-archiving.json' });
    openArchiveTab();
    verifyFieldsHaveCorrectState(true);

    cy.dropdown('Arkiveringspligt', 'K', true);

    verifyFieldsHaveCorrectState(false);
  });

  it('can modify archiving data', () => {
    cy.intercept('/api/v2/it-system-usages/*', { fixture: './it-system-usage' });
    openArchiveTab();

    cy.intercept('PATCH', '/api/v2/it-system-usages/*', { fixture: 'it-system-usage.json' }).as('patch');

    cy.dropdown('Arkiveringspligt', 'K', true);
    cy.wait('@patch')
      .its('request.body')
      .should('deep.eq', { archiving: { archiveDuty: 'K' } });

    cy.contains('Feltet er opdateret');

    cy.dropdown('ArkivType', 'Other type', true);
    cy.wait('@patch')
      .its('request.body')
      .should('deep.eq', { archiving: { typeUuid: 'aaad266c-3b84-49a0-8dc4-9d57b5dbc26b' } });

    cy.dropdown('Arkiveringssted', 'Other location', true);
    cy.wait('@patch')
      .its('request.body')
      .should('deep.eq', { archiving: { locationUuid: 'abc3266c-3b84-49a0-8dc4-9d57b5dbc26b' } });

    cy.dropdown('Arkiveringsleverandør', 'Organisation 2', true);
    cy.wait('@patch')
      .its('request.body')
      .should('deep.eq', { archiving: { supplierOrganizationUuid: '4dc52c64-3706-40f4-bf58-45035bb376da' } });

    cy.dropdown('Arkiveringsteststed', 'Other test location', true);
    cy.wait('@patch')
      .its('request.body')
      .should('deep.eq', { archiving: { testLocationUuid: 'agd3266c-3b84-49a0-8dc4-9d57b5dbc26b' } });

    cy.input('Arkiveringsfrekvens (antal år)').clear().type('2');
    cy.contains('Arkiveringsbemærkninger').click();
    cy.wait('@patch')
      .its('request.body')
      .should('deep.eq', { archiving: { frequencyInMonths: 2 } });

    cy.get('textarea').clear().type('new description');
    cy.input('Arkiveringsfrekvens (antal år)').click();
    cy.wait('@patch')
      .its('request.body')
      .should('deep.eq', { archiving: { notes: 'new description' } });

    cy.input('Dokumentbærende').uncheck();
    cy.wait('@patch')
      .its('request.body')
      .should('deep.eq', { archiving: { documentBearing: false } });

    cy.input('Nej').click();

    cy.wait('@patch')
      .its('request.body')
      .should('deep.eq', { archiving: { active: false } });
  });

  it('can add journal period', () => {
    cy.intercept('/api/v2/it-system-usages/*', { fixture: './archive/it-system-usage-no-journal-periods.json' });
    openArchiveTab();

    cy.contains('Tilføj Journalperiode').click();

    inputJournalDataAndValidate(true, false, './archive/it-system-usage-with-journal-period.json');
  });

  it('can edit journal period', () => {
    cy.intercept('/api/v2/it-system-usages/*', {
      fixture: './archive/it-system-usage-with-unedited-journal-period.json',
    });
    openArchiveTab();

    cy.get('app-pencil-icon').first().click({ force: true });

    inputJournalDataAndValidate(false, true, './archive/it-system-usage-with-journal-period.json');
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

function inputJournalDataAndValidate(shouldBeActive: boolean, isEdit: boolean, responseBodyPath: string) {
  //If the intercepts are not separate the test won't work
  //I don't see a reason why that is the case
  if (!isEdit) {
    cy.intercept('**journal-periods', responseBodyPath);
  } else {
    cy.intercept('**/journal-periods/**', responseBodyPath);
  }

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

  /* cy.verifyRequest(
    'journalPeriodsRequest',
    'request.body',
    (actual, expectedObject) => _.isEqual(actual, expectedObject),
    {
      startDate: '2023-12-31',
      endDate: '2049-12-31',
      archiveId: '123',
      active: shouldBeActive,
    }
  );

  cy.getRowForElementContent(newJournalPeriod.archiveId)
    .first()
    .within(() => {
      cy.contains(newJournalPeriod.startDate);
      cy.contains(newJournalPeriod.endDate);
      cy.contains(shouldBeActive == false ? 'Ja' : 'Nej');
    }); */
}

function verifyFieldsHaveCorrectState(shouldBeDisabled: boolean) {
  cy.contains('Læs mere hos Rigsarkivet');

  const disableOrEnableText = shouldBeDisabled ? 'be.disabled' : 'be.enabled';

  cy.input('ArkivType').should(disableOrEnableText);
  cy.input('Arkiveringssted').should(disableOrEnableText);

  cy.input('Arkiveringsleverandør').should(disableOrEnableText);
  cy.input('Arkiveringsteststed').should(disableOrEnableText);

  cy.input('Arkiveringsfrekvens (antal år)').should(disableOrEnableText);
  cy.contains('Dokumentbærende').parent().find('input').should(disableOrEnableText);
  cy.contains('Er der arkiveret fra systemet?').parent().find('input').should(disableOrEnableText);
  cy.get('textarea').should(disableOrEnableText);

  cy.contains('Tilføj Journalperiode').should(shouldBeDisabled ? 'not.exist' : 'exist');
}
