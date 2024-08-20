/// <reference types="Cypress" />

describe('it-contracts', () => {
  beforeEach(() => {
    cy.requireIntercept();
    cy.intercept('/odata/ItContractOverviewReadModels*', { fixture: './it-contracts/it-contracts.json' });
    cy.intercept('/api/v2/it-contracts/permissions*', { fixture: 'shared/create-permissions.json' });
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
    cy.setup(true, 'it-contracts');
  });

  it('can show IT contracts grid', () => {
    cy.get('h3').should('have.text', 'IT Kontrakter');

    cy.contains('Contract 1');
    cy.contains('Contract 2');
    cy.contains('Contract 3');
  });

  it('cant create if name already exists', () => {
    cy.intercept('/api/v2/it-contracts?nameEquals*', {
      fixture: './it-contracts/it-contracts-by-it-system-usage-uuid.json',
    });
    cy.getByDataCy('create-button').click();
    cy.inputByCy('create-name').type('The valid contract');
    // The name field waits for 500ms before calling the backend to verify if the name already exists
    cy.wait(500);
    cy.getByDataCy('name-error').should('exist');
  });
});
