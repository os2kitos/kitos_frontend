/// <reference types="Cypress" />

describe('data-processing', () => {
  beforeEach(() => {
    cy.requireIntercept();
    cy.intercept('/odata/DataProcessingRegistrationReadModels*', {
      fixture: './dpr/data-processings-odata.json',
    });
    cy.setup(true, 'data-processing');
  });

  it('can show data processing grid', () => {
    cy.get('h3').should('have.text', 'Databehandling');

    cy.contains('Dpa 1');
    cy.contains('Dpa 2');
    cy.contains('Dpa 3');
  });
});
