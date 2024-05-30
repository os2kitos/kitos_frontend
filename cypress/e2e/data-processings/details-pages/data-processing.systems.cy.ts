/// <reference types="Cypress" />

describe('data-processing', () => {
  beforeEach(() => {
    cy.requireIntercept();
    cy.intercept('/odata/DataProcessingRegistrationReadModels*', {
      fixture: './dpr/data-processings-odata.json',
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
    cy.intercept('/api/v2/-processing-registration-country-types*', {
      fixture: './dpr/choice-types/country-types.json',
    });
    cy.intercept('PATCH', '/api/v2/data-processing-registrations/*', {
      fixture: './dpr/data-processing-registration-patch.json',
    });
    cy.setup(true, 'data-processing');
  });

  it('System usage can be added', () => {
    cy.contains('Dpa 1').click();
    cy.navigateToDetailsSubPage('IT Systemer');

    cy.contains('Ingen systemer tilføjet endnu');
    cy.intercept('/api/v2/internal/data-processing-registrations/*/system-usages/available', {
      fixture: './dpr/data-processing-available-systems.json',
    });

    cy.getByDataCy('add-system-button').click();

    cy.get('app-dialog').within(() => {
      cy.dropdownByCy('system-usage-dropdown', 'test1', true);
      cy.getByDataCy('system-usage-save-button').click();
    });
    cy.get('app-popup-message').should('exist');
  });
});
