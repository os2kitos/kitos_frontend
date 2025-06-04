/// <reference types="cypress" />

import { TestRunner } from 'cypress/support/test-runner';

function setupTest() {
  cy.requireIntercept();
  cy.intercept('/api/v2/internal/organizations/*/permissions', {
    fixture: './organizations/organization-permissions-local-admin.json',
  });

  cy.intercept('api/v2/internal/data-processing/*/local-option-types/country-option-types', {
    fixture: './local-admin/dpr/local-country-option-types.json',
  });
  cy.intercept('api/v2/internal/data-processing/*/local-option-types/basis-for-transfer-types', {
    fixture: './local-admin/dpr/local-basis-for-transfer-types.json',
  });
  cy.intercept('api/v2/internal/data-processing/*/local-option-types/data-responsible-types', {
    fixture: './local-admin/dpr/local-data-responsible-types.json',
  });
  cy.intercept('api/v2/internal/data-processing/*/local-option-types/oversight-option-types', {
    fixture: './local-admin/dpr/local-oversight-option-types.json',
  });

  cy.setup(true, 'local-admin/data-processing');
}

describe('local-admin dpr', () => {
  const testRunner = new TestRunner(setupTest);

  it('Tests', () => {
    testRunner.runTestWithSetup('Can hide dpr module', () => {
      cy.getByDataCy('dpr-nav-bar-item').should('exist');
      cy.intercept('PATCH', 'api/v2/internal/organizations/*/ui-root-config', {
        fixture: './local-admin/dpr/ui-root-config-no-dpr-module.json',
      }).as('patch');

      cy.getByDataCy('toggle-module-button').click();

      cy.wait('@patch').then((interception) => {
        const newValue = interception.request.body.showDataProcessing;
        expect(newValue).to.equal(false);
      });
      cy.getByDataCy('dpr-nav-bar-item').should('not.exist');
    });

    testRunner.runTestWithSetup('Can see non editable option type info text', () => {
      cy.getByDataCy('local-admin-regular-option-types').click();
      cy.getByDataCy('accordion-info').first().trigger('mouseenter');
      cy.contains('Dette udfaldsrum kan kun redigeres af OS2Kitos sekretariatet');
    });

    testRunner.runTestWithSetup('Can see obligatory option info text', () => {
      cy.getByDataCy('local-admin-regular-option-types').click();
      cy.getByDataCy('accordion-header').first().click();
      cy.getByDataCy('grid-checkbox').first().trigger('mouseenter');
      cy.contains('Dette udfald er obligatorisk og kan kun deaktiveres af OS2Kitos sekretariatet');
    });
  });
});
