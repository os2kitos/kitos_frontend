/// <reference types="Cypress" />

import { TestRunner } from 'cypress/support/test-runner';

function setupTest() {
  cy.requireIntercept();
  cy.intercept('/api/v2/internal/organizations/*/permissions', {
    fixture: './organizations/organization-permissions-local-admin.json',
  });
  cy.intercept('api/v2/internal/organizations/*/grid/permissions', { statusCode: 404, body: {} });
  cy.intercept('/odata/Organizations?$skip=0&$top=100&$count=true', { fixture: './global-admin/organizations.json' });

  cy.intercept('api/v2/internal/kle/status', { fixture: './global-admin/kle-status-not-up-to-date.json' });

  cy.intercept('api/v2/internal/users/search', { fixture: './shared/users.json' });
  cy.intercept('api/v2/internal/users/*/organizations', { fixture: './organizations/organizations.json' });

  cy.intercept('api/v2/internal/organizations/*/ui-root-config', { body: {} });

  cy.intercept('api/v2/internal/organizations/*/grid/permissions', { statusCode: 404, body: {} });
  cy.intercept('api/v2/internal/broken-external-references-report/status', {
    fixture: './global-admin/broken-links-report',
  });
  cy.intercept('api/v2/internal/users/with-rightsholder-access', {
    fixture: './global-admin/rightsholders.json',
  });
  cy.intercept('api/v2/internal/users/with-cross-organization-permissions', {
    fixture: './global-admin/cross-org-users.json',
  });

  cy.intercept('/odata/Organizations?$skip=0&$top=100&$count=true', { fixture: './global-admin/organizations.json' });
  cy.intercept('api/v2/internal/users/system-integrators', { body: [] });
  cy.setup(true, 'global-admin/other');
}

describe('global-admin other', () => {
  it('Tests', () => {
    const testRunner = new TestRunner(setupTest);

    testRunner.runTestWithSetup('can perform kle update', () => {
      cy.getByDataCy('misc-segment').click();
      cy.intercept('api/v2/internal/kle/status', { fixture: './global-admin/kle-status-not-up-to-date.json' });

      cy.intercept('api/v2/internal/kle/changes', {
        fixture: './global-admin/kle-changes.csv',
      });
      cy.intercept('api/v2/internal/kle/update', {
        body: {},
      });

      cy.getByDataCy('update-kle-button').get('button').should('be.disabled');
      cy.getByDataCy('get-kle-changes-button').click();
      cy.getByDataCy('get-kle-changes-button').get('button').should('be.disabled');

      cy.intercept('api/v2/internal/kle/status', { fixture: './global-admin/kle-status-up-to-date.json' });
      cy.getByDataCy('update-kle-button').click();

      cy.getByDataCy('update-kle-button').get('button').should('be.disabled');
      cy.getByDataCy('get-kle-changes-button').get('button').should('be.disabled');
    });

    testRunner.runTestWithSetup('can shutdown user', () => {
      cy.intercept('DELETE', 'api/v2/internal/users/*', { body: {} });
      cy.dropdownByCy('remove-user-dropdown', 'test', true);

      cy.getByDataCy('delete-user-button').click();
      cy.getByDataCy('confirm-button').click();

      cy.get('app-popup-message').should('exist');
    });

    testRunner.runTestWithSetup('can get broken links report', () => {
      cy.getByDataCy('misc-segment').click();
      cy.intercept('api/v2/internal/broken-external-references-report/current/csv', {
        fixture: './global-admin/external-report.csv',
      });

      cy.contains('Rapport over brudte links');
      cy.contains('Oprettet: 14-11-2024');
      cy.contains('Antal registrerede fejl: 1');

      cy.getByDataCy('get-broken-links-button').click();
    });

    testRunner.runTestWithSetup('can get Api user organizations', () => {
      cy.getByDataCy('api-users-segment').click();
      cy.getByDataCy('show-organizations-button').first().click();

      cy.getByDataCy('organizations-dialog').within(() => {
        cy.contains('Fælles Kommune');
      });
    });

    testRunner.runTestWithSetup('Can add, delete and see system integrators', () => {
      const userToSelect = {
        name: 'Jens Jensen',
        email: 'jens@jensen.dk',
        uuid: 'd4efec33-2aea-4d89-927a-5d5899f6e616',
      };

      //Add system integrator
      cy.intercept('api/v2/internal/users/search', { body: [userToSelect] });

      cy.getByDataCy('open-add-system-integrator-dialog-button').click();
      cy.getByDataCy('add-system-integrator-dropdown').click();
      cy.dropdownByCy('add-system-integrator-dropdown', 'Jens Jensen', true);

      cy.intercept('api/v2/internal/users/system-integrators', { body: [userToSelect] });

      cy.intercept('PATCH', 'api/v2/internal/users/system-integrators/*', { statusCode: 204 });

      cy.getByDataCy('add-system-integrator-button').click();

      cy.contains(userToSelect.name);
      cy.contains(userToSelect.email);
      cy.get('app-popup-message').should('exist');

      //Delete system integrator
      cy.intercept('api/v2/internal/users/system-integrators/*', { statusCode: 204 });

      cy.intercept('api/v2/internal/users/system-integrators', { body: [] });

      cy.getByDataCy('grid-delete-button').click();
      cy.getByDataCy('confirm-button').click();

      cy.contains(userToSelect.name).should('not.exist');
      cy.contains(userToSelect.email).should('not.exist');
      cy.get('app-popup-message').should('exist');
    });
  });
});
