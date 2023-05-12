/// <reference types="Cypress" />

describe('it-system-usage', () => {
  beforeEach(() => {
    cy.requireIntercept();
    cy.intercept('/odata/ItSystemUsageOverviewReadModels*', { fixture: 'it-system-usages.json' });
    cy.intercept('/api/v2/it-system-usages/*', { fixture: 'it-system-usage.json' });
    cy.intercept('/api/v2/it-system-usage-data-classification-types*', { fixture: 'classification-types.json' });
    cy.intercept('/api/v2/it-system-usages/*/permissions', { fixture: 'permissions.json' });
    cy.intercept('/api/v2/it-systems/*', { fixture: 'it-system.json' }); //gets the base system
    cy.setup(true, 'it-systems/it-system-usages');
  });

  it('can show System roles', () => {
    cy.intercept('/api/v2/it-system-usages/*', { fixture: 'it-system-usage.json' });

    cy.contains('System 3').click();

    cy.intercept('/api/v2/it-system-usage-role-types*', { fixture: 'it-system-usage-available-roles.json' });
    cy.intercept('/api/v2/**/roles', { fixture: 'it-system-usage-roles.json' });

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
      row().contains(expectedRow.writeAccess ? 'Ja' : 'Nej');

      if (expectedRow.description) {
        row()
          .get('td')
          .first()
          .within(() => {
            cy.get('app-tooltip').should('have.attr', 'ng-reflect-text', expectedRow.description);
          });
      }
    }
  });

  it('can show empty System roles', () => {
    cy.intercept('/api/v2/it-system-usages/*', { fixture: 'it-system-usage.json' });

    cy.contains('System 3').click();

    cy.intercept('/api/v2/it-system-usage-role-types*', []);
    cy.intercept('/api/v2/**/roles', []);

    cy.navigateToDetailsSubPage('Systemroller');

    cy.contains('Ingen systemroller tilføjet endnu');
    cy.contains('Tilføj systemrolle');
  });

  it('can add new System role', () => {
    cy.intercept('/api/v2/it-system-usages/*', { fixture: 'it-system-usage.json' });

    cy.contains('System 3').click();

    cy.intercept('/api/v2/it-system-usage-role-types*', { fixture: 'it-system-usage-available-roles.json' });
    cy.intercept('/api/v2/**/roles', { fixture: 'it-system-usage-roles.json' });

    cy.navigateToDetailsSubPage('Systemroller');

    cy.intercept('/api/v2/**/users*', { fixture: 'users.json' });
    cy.contains('Tilføj systemrolle').click();

    //select user from the dropdown
    cy.dropdown('Vælg bruger', 'Automatisk oprettet testbruger (GlobalAdmin)', true);

    //select role from the dropdown
    cy.dropdown('Vælg rolle', 'TestRole', true);

    //validate can click the 'save' button
    cy.intercept('/api/v2/it-system-usages/**/add', {});
    cy.get('app-dialog').contains('Tilføj').click();
  });
});
