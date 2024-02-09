/// <reference types="Cypress" />

describe('it-system-usage', () => {
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

  function getKleRow(kleNumber: string) {
    return cy.contains(kleNumber).parentsUntil('tr').parent();
  }

  function verifyKle(kleNumber: string, name: string) {
    getKleRow(kleNumber).contains(name);
  }

  function verifyLocallyAddedKle(kleNumber: string, name: string) {
    getKleRow(kleNumber).contains(name);
    getKleRow(kleNumber).find('app-trashcan-icon').should('exist');
  }

  function verifyInheritedKle(kleNumber: string, name: string, irrelevant: boolean) {
    verifyKle(kleNumber, name);
    if (irrelevant) {
      getKleRow(kleNumber).find('app-plus-icon').should('exist');
    } else {
      getKleRow(kleNumber).find('app-trashcan-icon').should('exist');
    }
  }

  function toggleKle(kleNumber: string) {
    getKleRow(kleNumber).find('app-button').click();
  }

  function withinKleSection(title: string, within: () => void) {
    cy.contains(title)
      .parentsUntil('app-card')
      .parent()
      .within(() => {
        within();
      });
  }

  it('shows KLE page with neither inherited nor local KLE', () => {
    cy.intercept('/api/v2/kle-options', { fixture: './shared/kles.json' });
    cy.intercept('/api/v2/it-system-usages/*', { fixture: './it-system-usage/kle/it-system-usage-no-kle.json' });
    cy.intercept('/api/v2/it-systems/*', { fixture: './it-system-catalog/kle/it-system-no-kle.json' });

    cy.contains('System 3').click();
    cy.navigateToDetailsSubPage('Lokale KLE');

    withinKleSection('Nedarvede opgaver (Data fra IT Systemkataloget)', () => {
      cy.contains('Der er ikke registreret tilknyttede opgaver i IT Systemkataloget');
    });

    withinKleSection('Lokalt tilknyttede opgaver', () => {
      cy.contains('Der er endnu ikke registreret lokalt tilknyttede opgaver');
    });
  });

  it('shows KLE page inherited and local KLE for both opt-in and opt-out of inherited', () => {
    cy.intercept('/api/v2/kle-options', { fixture: './shared/kles.json' });
    cy.intercept('/api/v2/it-system-usages/*', {
      fixture: './it-system-usage/kle/it-system-usage-kle-opt-in-and-opt-out.json',
    });
    cy.intercept('/api/v2/it-systems/*', { fixture: './it-system-catalog/kle/it-system-with-kle.json' });

    cy.contains('System 3').click();
    cy.navigateToDetailsSubPage('Lokale KLE');

    withinKleSection('Nedarvede opgaver (Data fra IT Systemkataloget)', () => {
      verifyInheritedKle('00.30.12', 'Decentrale budgetter', false);
      verifyInheritedKle('00.30.14', 'Budgetopfølgninger', true);
    });

    withinKleSection('Lokalt tilknyttede opgaver', () => {
      verifyLocallyAddedKle('00.30.18', 'Tillægsbevillinger');
    });
  });

  it('Can restore inherited KLE option', () => {
    cy.intercept('/api/v2/kle-options', { fixture: './shared/kles.json' });
    cy.intercept('/api/v2/it-system-usages/*', {
      fixture: './it-system-usage/kle/it-system-usage-kle-opt-in-and-opt-out.json',
    });
    cy.intercept('/api/v2/it-systems/*', { fixture: './it-system-catalog/kle/it-system-with-kle.json' });

    cy.contains('System 3').click();
    cy.navigateToDetailsSubPage('Lokale KLE');

    withinKleSection('Nedarvede opgaver (Data fra IT Systemkataloget)', () => {
      toggleKle('00.30.14');
    });

    cy.confirmAction('Er du sikker på, at du vil gendanne den nedarvede opgave?');

    cy.intercept('PATCH', '/api/v2/it-system-usages/*', {
      fixture: './it-system-usage/kle/it-system-usage-no-kle.json',
    });

    withinKleSection('Nedarvede opgaver (Data fra IT Systemkataloget)', () => {
      //Verify that the toggled KLE is now shown as relevant
      verifyInheritedKle('00.30.14', 'Budgetopfølgninger', false);
    });

    cy.contains('Den nedarvede opgave blev gendannet');
  });

  it('Can remove inherited KLE option', () => {
    cy.intercept('/api/v2/kle-options', { fixture: './shared/kles.json' });
    cy.intercept('/api/v2/it-system-usages/*', { fixture: './it-system-usage/kle/it-system-usage-no-kle.json' });
    cy.intercept('/api/v2/it-systems/*', { fixture: './it-system-catalog/kle/it-system-with-kle.json' });

    cy.contains('System 3').click();
    cy.navigateToDetailsSubPage('Lokale KLE');

    withinKleSection('Nedarvede opgaver (Data fra IT Systemkataloget)', () => {
      toggleKle('00.30.14');
    });

    cy.confirmAction('Er du sikker på, at du vil fjerne den nedarvede opgave?');

    cy.intercept('PATCH', '/api/v2/it-system-usages/*', {
      fixture: './it-system-usage/kle/it-system-usage-kle-opt-in-and-opt-out.json',
    });

    withinKleSection('Nedarvede opgaver (Data fra IT Systemkataloget)', () => {
      //Verify that the toggled KLE is now shown as irrelevant
      verifyInheritedKle('00.30.14', 'Budgetopfølgninger', true);
    });

    cy.contains('Den nedarvede opgave blev fjernet');
  });

  it('Can remove local KLE option', () => {
    cy.intercept('/api/v2/kle-options', { fixture: './shared/kles.json' });
    cy.intercept('/api/v2/it-system-usages/*', {
      fixture: './it-system-usage/kle/it-system-usage-kle-opt-in-and-opt-out.json',
    });
    cy.intercept('/api/v2/it-systems/*', { fixture: './it-system-catalog/kle/it-system-with-kle.json' });

    cy.contains('System 3').click();
    cy.navigateToDetailsSubPage('Lokale KLE');

    withinKleSection('Lokalt tilknyttede opgaver', () => {
      toggleKle('00.30.18');
    });

    cy.confirmAction('Er du sikker på, at du vil fjerne den lokale tilknytning?');
    cy.intercept('PATCH', '/api/v2/it-system-usages/*', {
      fixture: './it-system-usage/kle/it-system-usage-no-kle.json',
    });

    withinKleSection('Lokalt tilknyttede opgaver', () => {
      cy.contains('Der er endnu ikke registreret lokalt tilknyttede opgaver');
    });
  });

  it('Can add local KLE option', () => {
    cy.intercept('/api/v2/kle-options', { fixture: './shared/kles.json' });
    cy.intercept('/api/v2/it-system-usages/*', { fixture: './it-system-usage/kle/it-system-usage-no-kle.json' });
    cy.intercept('/api/v2/it-systems/*', { fixture: './it-system-catalog/kle/it-system-with-kle.json' });

    cy.contains('System 3').click();
    cy.navigateToDetailsSubPage('Lokale KLE');

    withinKleSection('Lokalt tilknyttede opgaver', () => {
      cy.contains('Der er endnu ikke registreret lokalt tilknyttede opgaver');
      cy.contains('Tilknyt opgave').click();
    });

    cy.get('app-select-kle-dialog')
      .first()
      .within(() => {
        cy.get('app-dialog-actions').within(() => {
          cy.contains('Tilknyt').should('be.disabled');
        });
        cy.contains('Tilknyt opgave');
        cy.dropdown('Filtrer på hovedgruppe', '05 Veje og trafik', true);
        cy.dropdown('Filtrer på undergruppe', '05.00 Veje og trafik', true);
        cy.dropdown('Vælg eller fremsøg opgave', '05.00.05 Tilgængelighed, veje og trafik', true);
        cy.get('app-dialog-actions').within(() => {
          cy.contains('Tilknyt').click();
        });
      });

    cy.intercept('PATCH', '/api/v2/it-system-usages/*', {
      fixture: './it-system-usage/kle/it-system-usage-newly-added-kle.json',
    });

    cy.contains('Opgaven blev tilknyttet');

    withinKleSection('Lokalt tilknyttede opgaver', () => {
      verifyLocallyAddedKle('05.00.05', 'Tilgængelighed, veje og trafik');
    });
  });
});
