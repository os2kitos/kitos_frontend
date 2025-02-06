/// <reference types="Cypress" />

describe('it-contracts.roles', () => {
  beforeEach(() => {
    cy.requireIntercept();
    cy.setupContractIntercepts();
    cy.setup(true, 'it-contracts');
  });

  it('can show Contract roles', () => {
    cy.contains('Contract 1').click();

    cy.intercept('/api/v2/it-contract-role-types*', {
      fixture: './it-contracts/roles/it-contract-available-roles.json',
    });
    cy.intercept('/api/v2/**/roles', { fixture: './it-contracts/roles/it-contract-roles.json' });

    cy.navigateToDetailsSubPage('Kontraktroller');

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
});
