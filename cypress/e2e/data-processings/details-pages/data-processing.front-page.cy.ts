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

  it('Agreement conclusion date is enabled when agreement is concluded', () => {
    cy.contains('Dpa 1').click();

    cy.getByDataCy('dpr-agreement-concluded-date').find('input').should('be.disabled');
    cy.dropdownByCy('dpr-agreement-concluded', 'Ja', true);
    cy.getByDataCy('dpr-agreement-concluded-date').find('input').should('not.be.disabled');
  });

  it('Countries table is hidden or shown based on the transfer to third countries dropdown', () => {
    cy.contains('Dpa 1').click();

    cy.getByDataCy('countries-table').should('not.exist');
    cy.dropdownByCy('dpr-tranfer-to-3rd-country', 'Ja', true);
    cy.getByDataCy('countries-table').should('exist');
  });

  it('Subprocessor table is hidden or shown based on the subprocessor dropdown', () => {
    cy.contains('Dpa 1').click();

    cy.getByDataCy('subprocessors-table').should('not.exist');
    cy.dropdownByCy('dpr-subprocessors-yes-no', 'Ja', true);
    cy.getByDataCy('subprocessors-table').should('exist');
  });
});
