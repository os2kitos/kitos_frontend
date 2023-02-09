/// <reference types="Cypress" />

describe('it-systems', () => {
  beforeEach(() => {
    cy.requireIntercept();
  });

  it('can show page and details', () => {
    cy.intercept('/odata/ItSystemUsageOverviewReadModels*', { fixture: 'itsystems.json' });

    cy.setup(true, 'itsystems');

    cy.get('h3').should('have.text', 'IT systemer i Fælles Kommune');

    cy.contains('System 1');
    cy.contains('System 2');
    cy.contains('System 3').click();

    cy.contains('IT System Details (acaea4bb-e505-4ccc-aaf6-c066c681dade)');
  });
});
