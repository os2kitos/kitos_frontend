/// <reference types="Cypress" />

describe('it-system-usage', () => {
  beforeEach(() => {
    cy.requireIntercept();
    cy.setupItSystemUsageIntercepts();
    cy.setup(true, 'it-systems/it-system-usages');
  });

  it('shows simple hierarchy', () => {
    cy.intercept('/api/v2/it-systems/*/hierarchy', { fixture: './it-system-usage/hierarchy.json' });

    cy.contains('System 3').click();
    cy.navigateToDetailsSubPage('Hierarki');

    cy.get('app-it-system-hierarchy-table').within(() => {
      cy.contains('System 1');
      cy.contains('System 2');
    });
  });

  it('shows complex hierarchy', () => {
    cy.intercept('/api/v2/it-systems/*/hierarchy', { fixture: './it-system-usage/hierarchy-complex.json' });

    cy.contains('System 3').click();
    cy.navigateToDetailsSubPage('Hierarki');

    cy.get('app-it-system-hierarchy-table').within(() => {
      cy.contains('System 1');
      cy.contains('System 2');
      cy.contains('System 4');
      cy.contains('System 6');
    });
  });
});
