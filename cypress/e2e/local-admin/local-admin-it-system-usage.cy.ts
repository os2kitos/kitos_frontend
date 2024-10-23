/// <reference types="Cypress" />

describe('local-admin', () => {
  beforeEach(() => {
    cy.requireIntercept();

    cy.intercept('api/v2/internal/it-systems/*/local-option-types/business-types', {
      fixture: './local-admin/it-system/business-types.json',
    });
    cy.intercept('api/v2/internal/it-systems/*/local-option-types/archive-types', { body: [] });
    cy.intercept('api/v2/internal/it-systems/*/local-option-types/archive-location-types', { body: [] });
    cy.intercept('api/v2/internal/it-systems/*/local-option-types/archive-test-location-types', { body: [] });
    cy.intercept('api/v2/internal/it-systems/*/local-option-types/data-types', { body: [] });
    cy.intercept('api/v2/internal/it-systems/*/local-option-types/frequency-relation-types', { body: [] });
    cy.intercept('api/v2/internal/it-systems/*/local-option-types/interface-types', { body: [] });
    cy.intercept('api/v2/internal/it-systems/*/local-option-types/sensitive-personal-data-types', { body: [] });
    cy.intercept('api/v2/internal/it-systems/*/local-option-types/it-system-categories-types', { body: [] });
    cy.intercept('api/v2/internal/it-systems/*/local-option-types/local-register-types', { body: [] });
    cy.intercept('/api/v2/internal/organizations/*/permissions', {
      fixture: './organizations/organization-permissions-local-admin.json',
    });
    cy.setup(true, 'local-admin');
  });

  it('Can edit description of it system option type', () => {
    cy.getByDataCy('local-admin-it-system-button').click();
    cy.contains('Lokal tilpasning af udfaldsrum').click();

    cy.contains('Forretningstyper').click();
    cy.intercept('PATCH', 'api/v2/internal/it-systems/*/local-option-types/business-types/*', {});

    cy.contains('td', 'Desing, visualisering og grafik')
      .closest('tr')
      .within(() => {
        cy.get('app-icon-button').click();
      });
    cy.replaceTextByDataCy('description-text-area', 'New description');
    cy.contains('button', 'Gem').click();
  });

  it('Can deactivate active status of it system option type if not obligatory', () => {
    cy.getByDataCy('local-admin-it-system-button').click();
    cy.contains('Lokal tilpasning af udfaldsrum').click();

    cy.contains('Forretningstyper').click();
    cy.intercept('DELETE', 'api/v2/internal/it-systems/*/local-option-types/business-types/*', {});

    cy.contains('td', 'Desing, visualisering og grafik') // non-obligatory and active in response
      .closest('tr')
      .within(() => {
        cy.get('app-icon-button').click();
      });
    cy.getByDataCy('active-checkbox').find('input').click();
    cy.contains('button', 'Gem').click();
  });

  it('Can activate active status of it system option type if not obligatory', () => {
    cy.getByDataCy('local-admin-it-system-button').click();
    cy.contains('Lokal tilpasning af udfaldsrum').click();

    cy.contains('Forretningstyper').click();
    cy.intercept('POST', 'api/v2/internal/it-systems/*/local-option-types/business-types', {});

    cy.contains('td', 'Kommunikation') // non-obligatory and inactive in response
      .closest('tr')
      .within(() => {
        cy.get('app-icon-button').click();
      });
    cy.getByDataCy('active-checkbox').find('input').click();
    cy.contains('button', 'Gem').click();
  });

  it('Can not edit active status of option type if obligatory', () => {
    cy.getByDataCy('local-admin-it-system-button').click();
    cy.contains('Lokal tilpasning af udfaldsrum').click();

    cy.contains('Forretningstyper').click();

    cy.contains('td', 'Hjemmesider og portaler') // obligatory in response
      .closest('tr')
      .within(() => {
        cy.get('app-icon-button').click();
      });
    cy.getByDataCy('active-checkbox').should('not.exist');
  });
});
