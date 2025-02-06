/// <reference types="Cypress" />

describe('it-system-usage', () => {
  beforeEach(() => {
    cy.requireIntercept();
    cy.setupItSystemUsageIntercepts();
    cy.setup(true, 'it-systems/it-system-usages');
  });

  it('can show System roles', () => {
    cy.intercept('/api/v2/it-system-usages/*', { fixture: './it-system-usage/it-system-usage.json' });

    cy.contains('System 3').click();

    cy.intercept('/api/v2/it-system-usage-role-types*', {
      fixture: './it-system-usage/roles/it-system-usage-available-roles.json',
    });
    cy.intercept('/api/v2/**/roles', { fixture: './it-system-usage/roles/it-system-usage-roles.json' });

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
    cy.contains('System 3').click();

    cy.intercept('/api/v2/it-system-usage-role-types*', []);
    cy.intercept('/api/v2/**/roles', []);

    cy.navigateToDetailsSubPage('Systemroller');

    cy.contains('Ingen roller tilføjet endnu');
    cy.contains('Tilføj rolle');
  });

  it('can add new System role', () => {
    cy.contains('System 3').click();

    cy.intercept('/api/v2/it-system-usage-role-types*', {
      fixture: './it-system-usage/roles/it-system-usage-available-roles.json',
    });
    cy.intercept('/api/v2/**/roles', { fixture: './it-system-usage/roles/it-system-usage-roles.json' });

    cy.navigateToDetailsSubPage('Systemroller');

    cy.intercept('/api/v2/**/users*', { fixture: './shared/users.json' });
    cy.contains('Tilføj rolle').click();

    //select user from the dropdown
    cy.dropdown('Vælg bruger', 'Automatisk oprettet testbruger (GlobalAdmin)', true);

    //select role from the dropdown
    cy.dropdown('Vælg rolle', 'TestRole', true);

    //validate can click the 'save' button
    cy.intercept('/api/v2/it-system-usages/**/add', {});
    cy.get('app-dialog').contains('Tilføj').click();
  });
});
