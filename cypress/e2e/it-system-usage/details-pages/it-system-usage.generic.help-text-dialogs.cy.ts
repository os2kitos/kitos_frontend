/// <reference types="Cypress" />

describe('it-system-usage', () => {
  beforeEach(() => {
    cy.requireIntercept();
    cy.setupItSystemUsageIntercepts();
    cy.setup(true, 'it-systems/it-system-usages');
  });

  it('shows help text dialog', () => {
    cy.intercept('api/v2/internal/help-texts/*', { fixture: './shared/help-text.json' });

    cy.contains('System 3').click();

    cy.get('[data-cy="help-button"]').first().click();
    cy.contains('IT-systemforsiden finder du');
    cy.get('.close-button').click();

    cy.intercept('api/v2/internal/help-texts/*', { value: [] });

    cy.get('[data-cy="help-button"]').first().click();
    cy.contains('Ingen hjælpetekst defineret');
    cy.get('.close-button').click();

    cy.intercept('api/v2/internal/help-texts/*', { statusCode: 404 });

    cy.get('[data-cy="help-button"]').first().click();
    cy.contains('Ingen hjælpetekst defineret');
  });
});
