/// <reference types="Cypress" />

describe('data-processing-front-page', () => {
  beforeEach(() => {
    cy.requireIntercept();
    cy.setupDataProcessingIntercepts();

    cy.intercept('PATCH', 'api/v2/data-processing-registrations/*', {
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
});
