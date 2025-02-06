describe('it-contracts', () => {
  beforeEach(() => {
    cy.requireIntercept();

    cy.setupDataProcessingIntercepts();
    cy.setup(true, 'data-processing');
  });

  it('Can show data processing roles', () => {
    cy.contains('Dpa 1').click();

    cy.intercept('/api/v2/data-processing-registration-role-types*', {
      fixture: './dpr/roles/data-processing-available-roles.json',
    });
    cy.intercept('/api/v2/**/roles', { fixture: './dpr/roles/data-processing-roles.json' });

    cy.navigateToDetailsSubPage('Databehandlingsroller');

    const expectedRows = [
      {
        user: {
          email: 'local-regular-user@kitos.dk',
          name: 'Automatisk oprettet testbruger (User)',
        },
        role: { name: 'Standard læserolle' },
        writeAccess: false,
        description: null,
      },
      {
        user: {
          email: 'local-global-admin-user@kitos.dk',
          name: 'Automatisk oprettet testbruger (GlobalAdmin)',
        },
        role: { name: 'Standard skriverolle' },
        writeAccess: true,
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
});
