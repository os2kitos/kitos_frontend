/// <reference types="cypress" />

import { TestRunner } from 'cypress/support/test-runner';

function setupTest() {
  cy.requireIntercept();
  cy.setupItSystemUsageIntercepts();
  cy.setup(true, 'it-systems/it-system-usages');
}

describe('it-system-usage roles', () => {
  const testRunner = new TestRunner(setupTest);

  it('Tests', () => {
    testRunner.runTestWithSetup('can show System roles', () => {
      cy.intercept('/api/v2/it-system-usages/*', { fixture: './it-system-usage/it-system-usage.json' });

      cy.contains('System 3').click();

      setupRoleIntercepts();

      cy.navigateToDetailsSubPage('Systemroller');

      const expectedRows = [
        {
          user: {
            email: 'local-global-admin-user@kitos.dk',
            name: 'Automatisk oprettet testbruger (GlobalAdmin)',
          },
          role: { name: 'Changemanager' },
          writeAccess: true,
          description: 'test text',
        },
        {
          user: {
            email: 'local-global-admin-user@kitos.dk',
            name: 'Automatisk oprettet testbruger (GlobalAdmin)',
          },
          role: { name: 'Dataejer' },
          writeAccess: false,
          description: null,
        },
        {
          user: {
            email: 'local-global-admin-user@kitos.dk',
            name: 'Automatisk oprettet testbruger (GlobalAdmin)',
          },
          role: { name: 'Unavailable role (udgået)' },
          writeAccess: false,
          description: null,
        },
      ];

      for (const expectedRow of expectedRows) {
        const nameCell = cy.contains(expectedRow.role.name);
        const row = () => nameCell.parentsUntil('tr').parent();
        row().contains(expectedRow.user.email);
        row().contains(expectedRow.user.name);
        row()
          .get(expectedRow.writeAccess ? 'app-check-positive-green-icon' : 'app-check-negative-gray-icon')
          .should('exist');
      }
    });

    testRunner.runTestWithSetup('can show empty System roles', () => {
      cy.contains('System 3').click();

      cy.intercept('/api/v2/it-system-usage-role-types*', []);
      cy.intercept('/api/v2/**/roles', []);

      cy.navigateToDetailsSubPage('Systemroller');

      cy.contains('Ingen roller tilføjet endnu');
      cy.contains('Tilføj rolle');
    });

    testRunner.runTestWithSetup('can add new System role', () => {
      cy.contains('System 3').click();

      setupRoleIntercepts();

      cy.navigateToDetailsSubPage('Systemroller');

      cy.intercept('/api/v2/**/users*', { fixture: './shared/users.json' });
      cy.contains('Tilføj rolle').click();

      //select role from the dropdown
      cy.dropdown('Vælg rolle', 'TestRole', true);

      //select user from the dropdown
      cy.dropdown('Vælg bruger', 'Automatisk oprettet testbruger (GlobalAdmin)', true);
      cy.dropdown('Vælg bruger', 'Automatisk oprettet testbruger (LocalAdmin)', true);

      //validate can click the 'save' button
      cy.intercept('/api/v2/it-system-usages/**/add', {});
      cy.get('app-dialog').contains('Tilføj').click();
    });

    testRunner.runTestWithSetup('Can edit system role', () => {
      cy.contains('System 3').click();

      const exisitingRole = {
        user: {
          email: 'local-global-admin-user@kitos.dk',
          uuid: '8dd56b52-3f35-4f13-8d19-0d06b704ba02',
          name: 'Automatisk oprettet testbruger (GlobalAdmin)',
        },
        role: { uuid: '345869e5-9ee3-4568-a10a-7d4ab018d02e', name: 'Changemanager' },
      };
      setupRoleIntercepts();

      cy.intercept('/api/v2/**/roles', { body: [exisitingRole] });

      cy.navigateToDetailsSubPage('Systemroller');

      cy.intercept('/api/v2/**/users*', { fixture: './shared/users.json' });

      cy.getByDataCy('edit-role-button').first().click();

      cy.getByDataCy('save-button').find('button').should('be.disabled');
      cy.dropdownByCy('user-dropdown', 'Automatisk oprettet testbruger (LocalAdmin)', true);
      cy.getByDataCy('save-button').find('button').should('be.enabled');

      cy.intercept('PATCH', '/api/v2/it-system-usages/*/roles/remove', {
        fixture: './it-system-usage/it-system-usage.json',
      }).as('deleteRoleRequest');

      cy.intercept('PATCH', '/api/v2/it-system-usages/*', { fixture: './it-system-usage/it-system-usage.json' }).as(
        'updateRoleRequest'
      );

      cy.getByDataCy('save-button').click();

      cy.wait('@deleteRoleRequest').then(({ request }) => {
        expect(request.body).to.deep.equal({
          roleUuid: exisitingRole.role.uuid,
          userUuid: exisitingRole.user.uuid,
        });
      });

      cy.wait('@updateRoleRequest');

      cy.get('app-popup-message').should('exist');
    });
  });
});

function setupRoleIntercepts() {
  cy.intercept('/api/v2/it-system-usage-role-types*', {
    fixture: './it-system-usage/roles/it-system-usage-available-roles.json',
  });
  cy.intercept('/api/v2/**/roles', { fixture: './it-system-usage/roles/it-system-usage-roles.json' });
}
