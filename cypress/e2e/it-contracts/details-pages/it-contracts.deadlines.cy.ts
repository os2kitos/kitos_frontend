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
    cy.intercept('/api/v2/it-contracts/*', { fixture: './it-contracts/it-contract.json' });
    cy.intercept('/api/v2/organizations/*/users', { fixture: './organizations/organization-users.json' });
    cy.intercept('/api/v2/organizations?orderByProperty*', { fixture: './organizations/organizations-multiple.json' });
    cy.intercept('/api/v2/organizations/*/organization-units*', {
      fixture: './organizations/organization-units-hierarchy.json',
    });
    cy.intercept('/api/v2/it-contracts/*/permissions', { fixture: './it-contracts/it-contract-permissions.json' });
    cy.intercept('api/v2/it-contracts?organizationUuid*', {
      fixture: './it-contracts/it-contracts-by-it-system-usage-uuid.json',
    });
    cy.intercept('/api/v2/internal/organizations/*/grid/permissions', {statusCode: 404, body: {}});
    cy.intercept('/api/v2/internal/organizations/*/grid/*/*', {statusCode: 404, body: {}});
    cy.intercept('api/v2/internal/it-contracts/applied-procurement-plans/*', { body: [] });
    cy.setup(true, 'it-contracts');
  });

  it('Duration is reset and disabled when IsContinous is true', () => {
    goToDeadlines();

    cy.inputByCy('deadlines-duration-years').should('have.value', '12');
    cy.inputByCy('deadlines-duration-months').should('have.value', '5');

    cy.intercept('PATCH', '/api/v2/it-contracts/*', {
      fixture: './it-contracts/deadlines/it-contract-with-continous-true.json',
    });
    cy.getByDataCy('deadlines-is-continous').find('input').check();

    cy.getByDataCy('deadlines-duration-years').find('mat-form-field').should('have.class', 'mat-form-field-disabled');
    cy.getByDataCy('deadlines-duration-months').find('mat-form-field').should('have.class', 'mat-form-field-disabled');
  });
});

function goToDeadlines() {
  cy.contains('Contract 1').click();
  cy.navigateToDetailsSubPage('Aftalefrister');
}
