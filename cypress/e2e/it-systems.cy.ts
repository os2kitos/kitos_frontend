/// <reference types="Cypress" />

describe('it-systems', () => {
  beforeEach(() => {
    cy.requireIntercept();
    cy.intercept('/odata/ItSystemUsageOverviewReadModels*', { fixture: 'itsystems.json' });
    cy.setup(true, 'it-systems');
  });

  it('can show page and details', () => {
    cy.get('h3').should('have.text', 'IT systemer i Fælles Kommune');

    cy.contains('System 1');
    cy.contains('System 2');
    cy.contains('System 3').click();

    cy.contains('IT System Details (acaea4bb-e505-4ccc-aaf6-c066c681dade)');
  });

  it('can filter grid', () => {
    cy.intercept('/odata/ItSystemUsageOverviewReadModels*', { fixture: 'itsystems.json' }).as('itSystems');

    cy.contains('Søg på IT systemnavn').parent().find('input').type('System');

    cy.wait('@itSystems').its('request.url').should('contain', 'contains(systemName,%27System%27)');

    cy.contains('Søg på Sidst ændret ID').parent().find('input').type('1');

    cy.wait('@itSystems')
      .its('request.url')
      .should('contain', 'contains(systemName,%27System%27)%20and%20lastChangedById%20eq%201');
  });
});
