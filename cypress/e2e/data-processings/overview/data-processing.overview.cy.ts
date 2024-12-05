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
    cy.intercept('/api/v2/internal/organizations/*/grid/permissions', {statusCode: 404, body: {}});
    cy.intercept('/api/v2/internal/organizations/*/grid/*/*', {statusCode: 404, body: {}});
    cy.setup(true, 'data-processing');
  });

  it('can show data processing grid', () => {
    cy.get('h3').should('have.text', 'Databehandling');

    cy.contains('Dpa 1');
    cy.contains('Dpa 2');
    cy.contains('Dpa 3');
  });

  it('cant create if name already exists', () => {
    cy.intercept('/api/v2/data-processing-registrations?nameEquals*', {
      fixture: './dpr/data-processings-name-exists-search.json',
    });

    cy.getByDataCy('grid-options-button').click().click();
    cy.getByDataCy('create-button').click();
    cy.inputByCy('create-name').type('DefaultDpa');
    // The name field waits for 500ms before calling the backend to verify if the name already exists
    cy.wait(500);
    cy.getByDataCy('name-error').should('exist');
  });
});
