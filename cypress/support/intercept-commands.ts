/* eslint-disable @typescript-eslint/no-explicit-any */

Cypress.Commands.add('setupContractIntercepts', () => {
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
  cy.intercept('/api/v2/internal/organizations/*/grid/permissions', { statusCode: 404, body: {} });
  cy.intercept('/api/v2/internal/organizations/*/grid/*/*', { statusCode: 404, body: {} });
  cy.intercept('api/v2/internal/it-contracts/applied-procurement-plans/*', { body: [] });
});

Cypress.Commands.add('setupDataProcessingIntercepts', () => {
  cy.intercept('odata/DataProcessingRegistrationReadModels*', {
    fixture: './dpr/data-processings-odata.json',
  });
  cy.intercept('api/v1/data-processing-registration/available-options-in/organization/*', {
    fixture: 'dpr/data-processing-options.json',
  });
  cy.intercept('api/v2/data-processing-registrations/permissions*', { fixture: 'shared/create-permissions.json' });
  cy.intercept('api/v2/data-processing-registrations/*/permissions', { fixture: './shared/permissions.json' });
  cy.intercept('api/v2/data-processing-registrations/*', { fixture: './dpr/data-processing-registration.json' });
  cy.intercept('api/v2/data-processing-registration-basis-for-transfer-types*', {
    fixture: './dpr/choice-types/basis-for-transfer-types.json',
  });
  cy.intercept('api/v2/data-processing-registration-data-responsible-types*', {
    fixture: './dpr/choice-types/data-responsible-types.json',
  });
  cy.intercept('api/v2/internal/organizations/*/grid/permissions', { statusCode: 404, body: {} });
  cy.intercept('api/v2/internal/organizations/*/grid/*/*', { statusCode: 404, body: {} });
});

Cypress.Commands.add('setupItSystemCatalogIntercepts', () => {
  cy.intercept('/odata/ItSystems*', { fixture: './it-system-catalog/it-systems.json' });
  cy.intercept('/api/v2/it-systems/*/permissions', { fixture: './it-system-catalog/it-system-permissions.json' });
  cy.intercept('/api/v2/business-types*', { fixture: './shared/business-types.json' });
  cy.intercept('/api/v2/internal/it-systems/search*', { fixture: './it-system-catalog/it-systems-v2.json' });
  cy.intercept('/api/v2/organizations', { fixture: './organizations/organizations-multiple.json' });
  cy.intercept('/api/v2/kle-options', { fixture: './it-system-catalog/kle/kles.json' });
  cy.intercept('/api/v2/it-systems/*', { fixture: './it-system-catalog/it-system.json' });
  cy.intercept('/api/v2/it-system-usages?organizationUuid*', []);
  cy.intercept('/api/v2/it-system-usages/permissions?organizationUuid*', {
    fixture: './it-system-usage/it-system-usage-collection-permissions.json',
  });
  cy.intercept('/api/v2/internal/organizations/*/grid/permissions', { statusCode: 404, body: {} });
  cy.intercept('/api/v2/internal/organizations/*/grid/*/*', { statusCode: 404, body: {} });
});

Cypress.Commands.add('setupItSystemUsageIntercepts', () => {
  cy.intercept('/odata/ItSystemUsageOverviewReadModels*', { fixture: './it-system-usage/it-system-usages.json' });
  cy.intercept('/api/v1/itsystem-usage/options/overview/organizationUuid*', {
    fixture: './it-system-usage/options.json',
  });
  cy.intercept('/api/v2/organizations/*/organization-units?pageSize=*', {
    fixture: './organizations/organization-units-hierarchy.json',
  });
  cy.intercept('/api/v2/business-types*', { fixture: './shared/business-types.json' });
  cy.intercept('/api/v2/it-system-usages/*', { fixture: './it-system-usage/it-system-usage.json' });
  cy.intercept('/api/v2/it-system-usage-data-classification-types*', {
    fixture: './it-system-usage/classification-types.json',
  });
  cy.intercept('/api/v2/it-system-usages/*/permissions', { fixture: './shared/permissions.json' });
  cy.intercept('/api/v2/it-systems/*', { fixture: 'it-system.json' }); //gets the base system
  cy.intercept('/api/v2/internal/organizations/*/grid/permissions', { statusCode: 404, body: {} });
  cy.intercept('/api/v2/internal/organizations/*/grid/*/*', { statusCode: 404, body: {} });
});
