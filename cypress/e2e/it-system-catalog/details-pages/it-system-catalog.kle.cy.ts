/// <reference types="Cypress" />

describe('it-system-catalog', () => {
  beforeEach(() => {
    cy.requireIntercept();
    cy.intercept('/odata/ItSystems*', { fixture: './it-system-catalog/it-systems.json' });
    cy.intercept('/api/v2/it-systems/*/permissions', { fixture: './it-system-catalog/it-system-permissions.json' });
    cy.intercept('/api/v2/business-types*', { fixture: './shared/business-types.json' });
    cy.intercept('/api/v2/internal/it-systems/search*', { fixture: './it-system-catalog/it-systems-v2.json' });
    cy.intercept('/api/v2/organizations', { fixture: './organizations/organizations-multiple.json' });
    cy.intercept('/api/v2/kle-options', { fixture: './shared/kles.json' });
    cy.intercept('/api/v2/it-systems/*', { fixture: './it-system-catalog/it-system.json' });
    cy.intercept('/api/v2/it-system-usages?organizationUuid*', []);
    cy.intercept('/api/v2/it-system-usages/permissions?organizationUuid*', {
      fixture: './it-system-usage/it-system-usage-collection-permissions.json',
    });
    cy.intercept('/api/v2/internal/organizations/*/grid/permissions', { statusCode: 404, body: {} });
    cy.intercept('/api/v2/internal/organizations/*/grid/*/*', { statusCode: 404, body: {} });
    cy.setup(true, 'it-systems/it-system-catalog');
  });

  it('Can remove local KLE option', () => {
    cy.intercept('/api/v2/it-systems/*', { fixture: './it-system-catalog/kle/it-system-with-kle.json' });

    cy.contains('System 3').click();
    cy.navigateToDetailsSubPage('KLE');

    withinKleSection('Tilknyttede opgaver', () => {
      toggleKle('00.30.14');
    });

    cy.intercept('PATCH', '/api/v2/it-systems/*', {
      fixture: './it-system-catalog/kle/it-system-no-kle.json',
    });
    cy.confirmAction('Er du sikker på, at du vil fjerne denne tilknytning?');

    withinKleSection('Tilknyttede opgaver', () => {
      cy.contains('Der er endnu ikke registreret tilknyttede opgaver');
    });
  });

  it('Can add local KLE option', () => {
    cy.intercept('/api/v2/it-systems/*', { fixture: './it-system-catalog/kle/it-system-no-kle.json' });

    cy.contains('System 3').click();
    cy.navigateToDetailsSubPage('KLE');

    withinKleSection('Tilknyttede opgaver', () => {
      cy.contains('Der er endnu ikke registreret tilknyttede opgaver');
      cy.getByDataCy('addKleButton').click();
    });

    cy.get('app-select-kle-dialog')
      .first()
      .within(() => {
        cy.get('app-dialog-actions').within(() => {
          cy.contains('Tilknyt').should('be.disabled');
        });
        cy.contains('Tilknyt opgave');
        cy.dropdownByCy('mainGroupFilter', '05 Veje og trafik', true);
        cy.dropdownByCy('subGroupFilter', '05.00 Veje og trafik', true);
        cy.dropdownByCy('kleTaskSelection', '05.00.05 Tilgængelighed, veje og trafik', true);
        cy.get('app-dialog-actions').within(() => {
          cy.contains('Tilknyt').click();
        });
      });

    cy.intercept('PATCH', '/api/v2/it-systems/*', {
      fixture: './it-system-catalog/kle/it-system-with-kle.json',
    });

    cy.contains('Opgaven blev tilknyttet');

    withinKleSection('Tilknyttede opgaver', () => {
      verifyLocallyAddedKle('00.30.12', 'Decentrale budgetter');
    });
  });
});

function withinKleSection(title: string, within: () => void) {
  cy.contains(title)
    .parentsUntil('app-card')
    .parent()
    .within(() => {
      within();
    });
}

function verifyLocallyAddedKle(kleNumber: string, name: string) {
  getKleRow(kleNumber).contains(name);
  getKleRow(kleNumber).find('app-trashcan-icon').should('exist');
}

function getKleRow(kleNumber: string) {
  return cy.contains(kleNumber).parentsUntil('tr').parent();
}

function toggleKle(kleNumber: string) {
  getKleRow(kleNumber).find('app-button').click();
}
