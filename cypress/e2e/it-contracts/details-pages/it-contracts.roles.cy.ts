/// <reference types="Cypress" />

describe('it-contracts', () => {
  beforeEach(() => {
    cy.requireIntercept();
    cy.intercept('/api/v2/it-contracts/*', { fixture: './it-contracts/it-contract.json' });
    cy.intercept('/api/v2/organizations/*/users', { fixture: './organizations/organization-users.json' });
    cy.intercept('/api/v2/organizations?orderByProperty*', { fixture: './organizations/organizations-multiple.json' });
    cy.intercept('/api/v2/organizations/*/organization-units*', {
      fixture: './organizations/organization-units-hierarchy.json',
    });

    cy.intercept('/odata/ItContractOverviewReadModels*', { fixture: './it-contracts/it-contracts.json' });
    cy.intercept('/api/v2/it-contracts/permissions*', { fixture: 'shared/create-permissions.json' });
    cy.intercept('/api/v2/internal/it-contracts/grid-roles/*', { fixture: './it-contracts/grid-roles.json' });
    cy.intercept('/api/v2/it-contract-contract-types*', { fixture: './it-contracts/choice-types/contract-types.json' });
    cy.intercept('/api/v2/it-contract-contract-template-types*', {
      fixture: './it-contracts/choice-types/contract-templates.json',
    });
    cy.intercept('/api/v2/it-contract-criticality-types*', {
      fixture: './it-contracts/choice-types/criticality-types.json',
    });
    cy.intercept('/api/v2/it-contract-procurement-strategy-types*', {
      fixture: './it-contracts/choice-types/procurement-strategies.json',
    });
    cy.intercept('/api/v2/it-contract-purchase-types*', { fixture: './it-contracts/choice-types/purchase-types.json' });
    cy.intercept('/api/v2/it-contract-agreement-extension-option-types*', {
      fixture: './it-contracts/choice-types/extension-options.json',
    });
    cy.intercept('/api/v2/it-contract-notice-period-month-types*', {
      fixture: './it-contracts/choice-types/notice-period-month-types.json',
    });
    cy.intercept('/api/v2/it-contract-payment-frequency-types*', {
      fixture: './it-contracts/choice-types/frequency-types.json',
    });
    cy.intercept('/api/v2/it-contract-payment-model-types*', {
      fixture: './it-contracts/choice-types/payment-model.json',
    });
    cy.intercept('/api/v2/it-contract-price-regulation-types*', {
      fixture: './it-contracts/choice-types/price-regulation-types.json',
    });

    cy.intercept('/api/v2/it-contracts/*/permissions', { fixture: './it-contracts/it-contract-permissions.json' });
    cy.intercept('api/v2/it-contracts?organizationUuid*', {
      fixture: './it-contracts/it-contracts-by-it-system-usage-uuid.json',
    });
    cy.intercept('/api/v2/internal/organizations/*/grid/permissions', {statusCode: 404, body: {}});
    cy.intercept('/api/v2/internal/organizations/*/grid/*/*', {statusCode: 404, body: {}});
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
});
