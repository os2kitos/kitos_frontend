/// <reference types="Cypress" />

describe('data-processing', () => {
  beforeEach(() => {
    cy.requireIntercept();
    cy.intercept('/odata/DataProcessingRegistrationReadModels*', {
      fixture: './dpr/data-processings-odata.json',
    });
    cy.intercept('/api/v1/data-processing-registration/available-options-in/organization/*', {
      fixture: 'dpr/data-processing-options.json',
    });
    cy.intercept('/api/v2/data-processing-registrations/permissions*', { fixture: 'shared/create-permissions.json' });
    cy.intercept('/api/v2/data-processing-registrations/*/permissions', { fixture: './shared/permissions.json' });
    cy.intercept('/api/v2/data-processing-registrations/*', { fixture: './dpr/data-processing-registration.json' });
    cy.intercept('/api/v2/data-processing-registration-basis-for-transfer-types*', {
      fixture: './dpr/choice-types/basis-for-transfer-types.json',
    });
    cy.intercept('/api/v2/data-processing-registration-data-responsible-types*', {
      fixture: './dpr/choice-types/data-responsible-types.json',
    });
    cy.intercept('/api/v2/data-processing-registration-country-types*', {
      fixture: './dpr/choice-types/country-types.json',
    });
    cy.intercept('/api/v2/data-processing-registration-oversight-types*', {
      fixture: './dpr/choice-types/oversight-types.json',
    });
    cy.setup(true, 'data-processing');
  });

  it('Can create oversight', () => {
    cy.contains('Dpa 1').click();
    cy.navigateToDetailsSubPage('Tilsyn');

    cy.getByDataCy('oversight-create-button').click();

    cy.get('app-dialog').within(() => {
      cy.dropdownByCy('dropdown-selector', 'Egen kontrol', true);
      cy.getByDataCy('save-button').click();
    });
    cy.get('app-popup-message').should('exist');
  });
  /*
  Removed until fixed in: https://os2web.atlassian.net/browse/KITOSUDV-5142
  it('Can create oversight date', () => {
    cy.contains('Dpa 1').click();
    cy.navigateToDetailsSubPage('Tilsyn');

    cy.getByDataCy('add-oversight-date-button').click();

    cy.get('app-dialog').within(() => {
      cy.datepickerByCy('datepicker-control', '21', true);
      cy.textareaByCy('notes-control').type('some description');

      cy.getByDataCy('save-button').click();
    });
    cy.get('app-popup-message').should('exist');
  }); */
});
