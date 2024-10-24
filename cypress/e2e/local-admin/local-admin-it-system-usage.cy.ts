/// <reference types="Cypress" />

const regularOptionTypesSegment = 'Lokal tilpasning af udfaldsrum';

describe('local-admin it system usage', () => {
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
    cy.setup(true, 'local-admin/system');
  });

  it('Cannot toggle obligatory ui customization field', () => {
    const targetTabCheckboxButtonText = 'Systemforside';
    cy.contains(targetTabCheckboxButtonText)
      .parents('[data-cy="accordion-header"]')
      .first()
      .getByDataCy('button-checkbox')
      .get('mat-checkbox input')
      .first()
      .should('be.checked');
  });

  it('Can toggle non-obligatory ui customization field', () => {
    cy.intercept('api/v2/internal/organizations/*/ui-customization/ItSystemUsages', {
      fixture: './shared/it-system-usage-ui-customization-no-gdpr.json',
    });

    cy.intercept('PUT', 'api/v2/internal/organizations/*/ui-customization/ItSystemUsages').as('put');

    const targetFieldCheckboxButtonText = 'Dato for planlagt risikovurdering';
    cy.contains(targetFieldCheckboxButtonText).click();
    cy.wait('@put').then((interception) => {
      const nodes = interception.request.body.nodes;
      const gdprNode = nodes.find(
        (node: { key: string; enabled: boolean }) => node.key === 'ItSystemUsages.gdpr.plannedRiskAssessmentDate'
      );
      expect(gdprNode.enabled).to.equal(false);
    });

    cy.contains(targetFieldCheckboxButtonText).within(() => {
      cy.getByDataCy('button-checkbox').get('mat-checkbox input').first().should('not.be.checked');
    });
  });

  it('Can edit description of it system option type', () => {
    cy.contains(regularOptionTypesSegment).click();

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
    cy.contains(regularOptionTypesSegment).click();

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
    cy.contains(regularOptionTypesSegment).click();

    cy.contains('Forretningstyper').click();

    cy.contains('td', 'Hjemmesider og portaler') // obligatory in response
      .closest('tr')
      .within(() => {
        cy.get('app-icon-button').click();
      });
    cy.getByDataCy('active-checkbox').should('not.exist');
  });
});
