/// <reference types="Cypress" />

describe('it-contracts', () => {
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
    cy.setup(true, 'data-processing');
  });

  it('Agreement conclusion date is enabled when agreement is concluded', () => {
    cy.contains('Dpa 1').click();

    cy.getByDataCy('dpr-agreement-concluded-date').find('input').should('be.disabled');
    cy.dropdownByCy('dpr-agreement-concluded', 'Ja', true);
    cy.getByDataCy('dpr-agreement-concluded-date').find('input').should('not.be.disabled');
  });
});
