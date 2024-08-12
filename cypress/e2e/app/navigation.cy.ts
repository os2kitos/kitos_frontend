/// <reference types="Cypress" />

describe('navigation', () => {
  beforeEach(() => {
    cy.requireIntercept();
    cy.intercept('/api/**/permissions*', { fixture: 'shared/create-permissions.json' });
    cy.intercept('/api/v1/itsystem-usage/options/overview/organizationUuid*', {
      fixture: './it-system-usage/options.json',
    });
    cy.intercept('/api/v2/organizations/*/organization-units?pageSize=*', {
      fixture: './organizations/organization-units-hierarchy.json',
    });
    cy.intercept('/api/v2/business-types*', { fixture: './shared/business-types.json' });
    cy.setup(true);
  });

  it('can navigate between pages', () => {
    cy.intercept('/odata/**', {});

    cy.contains('Kitos - Kommunernes IT OverbliksSystem');

    cy.get('app-nav-bar').contains('Organisation').click();
    cy.get('h3').should('have.text', 'Organisation');

    cy.get('app-nav-bar').contains('IT Systemer').click();
    cy.get('h3').should('have.text', 'IT Systemer i Fælles Kommune');

    cy.get('app-nav-bar').contains('IT Systemer').click();
    cy.contains('IT Systemkatalog').click();
    cy.get('h3').should('have.text', 'IT Systemkatalog');

    cy.get('app-nav-bar').contains('IT Kontrakter').click();
    cy.get('h3').should('have.text', 'IT Kontrakter');

    cy.get('app-nav-bar').contains('Databehandling').click();
    cy.get('h3').should('have.text', 'Databehandling');

    cy.get('app-nav-bar').contains('Test User').click();
    cy.get('h3').should('have.text', 'Min profil');

    cy.get('app-nav-bar').get('img').first().click();
    cy.contains('Kitos - Kommunernes IT OverbliksSystem');
  });
});
