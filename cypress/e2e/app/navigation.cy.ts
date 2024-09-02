/// <reference types="Cypress" />

describe('navigation', () => {
  beforeEach(() => {
    cy.requireIntercept();
    cy.intercept('/api/**/permissions*', { fixture: 'shared/create-permissions.json' });
    cy.intercept('/api/v1/data-processing-registration/available-options-in/organization/*', {
      fixture: 'dpr/data-processing-options.json',
    });
    cy.intercept('/api/v1/itsystem-usage/options/overview/organizationUuid*', {
      fixture: './it-system-usage/options.json',
    });
    cy.intercept('/api/v2/organizations/*/organization-units?pageSize=*', {
      fixture: './organizations/organization-units-hierarchy.json',
    });
    cy.intercept('/api/v2/organizations/*/organization-units', {
      fixture: './organizations/organization-units-hierarchy.json',
    });
    cy.intercept('/api/v2/business-types*', { fixture: './shared/business-types.json' });
    cy.intercept('/api/v2/internal/it-contracts/grid-roles/*', { fixture: './it-contracts/grid-roles.json' });
    cy.intercept('/api/v2/it-contract-contract-types*', { fixture: './it-contracts/choice-types/contract-types.json' });
    cy.intercept('/api/v2/it-contract-contract-template-types*', {
      fixture: './it-contracts/choice-types/contract-templates.json',
    });
    cy.intercept('/api/v2/it-contract-criticality-types*', {
      fixture: './it-contracts/choice-types/criticality-types.json',
    });
    cy.intercept('/api/v2/it-contract-procurement-strategy-types*', {
      fixture: './it-contracts/choice-types/procurement-strategies.json',
    });
    cy.intercept('/api/v2/it-contract-purchase-types*', { fixture: './it-contracts/choice-types/purchase-types.json' });
    cy.intercept('/api/v2/it-contract-agreement-extension-option-types*', {
      fixture: './it-contracts/choice-types/extension-options.json',
    });
    cy.intercept('/api/v2/it-contract-notice-period-month-types*', {
      fixture: './it-contracts/choice-types/notice-period-month-types.json',
    });
    cy.intercept('/api/v2/it-contract-payment-frequency-types*', {
      fixture: './it-contracts/choice-types/frequency-types.json',
    });
    cy.intercept('/api/v2/it-contract-payment-model-types*', {
      fixture: './it-contracts/choice-types/payment-model.json',
    });
    cy.intercept('/api/v2/it-contract-price-regulation-types*', {
      fixture: './it-contracts/choice-types/price-regulation-types.json',
    });
    cy.setup(true);
  });

  it('can navigate between pages', () => {
    cy.intercept('/odata/**', {});

    cy.contains('Kitos - Kommunernes IT OverbliksSystem');

    cy.get('app-nav-bar').contains('Organisation').click();
    cy.get('h4').should('have.text', 'Organisation');

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
