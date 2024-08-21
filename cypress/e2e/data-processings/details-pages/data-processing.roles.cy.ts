describe('it-contracts', () => {
  beforeEach(() => {
    cy.requireIntercept();
    cy.intercept('/odata/DataProcessingRegistration*', { fixture: './dpr/data-processings-odata.json' });
    cy.intercept('/api/v1/data-processing-registration/available-options-in/organization/*', {
      fixture: 'dpr/data-processing-options.json',
    });
    cy.intercept('/api/v2/data-processing-registrations/permissions*', { fixture: 'shared/create-permissions.json' });
    cy.intercept('/api/v2/data-processing-registrations/*/permissions', { fixture: './shared/permissions.json' });
    cy.intercept('/api/v2/data-processing-registrations/*', { fixture: './dpr/data-processing-registration.json' });
    cy.intercept('/api/v2/data-processing-registration-basis-for-transfer-types*', {
      fixture: './dpr/choice-types/basis-for-transfer-types.json',
    });
    cy.intercept('/api/v2/data-processing-registration-data-responsible-types*', {
      fixture: './dpr/choice-types/data-responsible-types.json',
    });
    cy.intercept('/api/v2/-processing-registration-country-types*', {
      fixture: './dpr/choice-types/country-types.json',
    });
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
      row().contains(expectedRow.writeAccess ? 'Ja' : 'Nej');
    }
  });
});
