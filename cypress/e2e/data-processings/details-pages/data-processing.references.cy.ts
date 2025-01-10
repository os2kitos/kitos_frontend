/// <reference types="Cypress" />

describe('data-processing-references', () => {
  beforeEach(() => {
    cy.requireIntercept();

    cy.setupDataProcessingIntercepts();
    cy.setup(true, 'data-processing');
  });

  it('Can show empty references page', () => {
    cy.contains('Dpa 1').click();
    cy.navigateToDetailsSubPage('Referencer');
  });
});
