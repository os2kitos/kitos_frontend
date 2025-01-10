/// <reference types="Cypress" />

describe('it-contracts.systems', () => {
  beforeEach(() => {
    cy.requireIntercept();
    cy.intercept('/api/v2/it-contracts/*', { fixture: './it-contracts/it-contract.json' });
    cy.intercept('/api/v2/organizations/*/users', { fixture: './organizations/organization-users.json' });
    cy.intercept('/api/v2/organizations?orderByProperty*', { fixture: './organizations/organizations-multiple.json' });
    cy.intercept('/api/v2/organizations/*/organization-units*', {
      fixture: './organizations/organization-units-hierarchy.json',
    });

    cy.setupContractIntercepts();
    cy.intercept('/api/v2/it-contracts/*/permissions', { fixture: './it-contracts/it-contract-permissions.json' });
    cy.intercept('/api/v2/it-contract-agreement-element-types?organizationUuid=*', {
      fixture: './it-contracts/choice-types/agreement-elements.json',
    });
    cy.intercept('/api/v2/internal/it-system-usages/relations/*', {
      fixture: './it-contracts/it-contract-system-relations.json',
    });
    cy.setup(true, 'it-contracts');
  });

  it('create agreement element', () => {
    goToSystem();

    cy.getByDataCy('add-agreement-element-button').click();
    cy.get('app-dialog').within(() => {
      cy.getByDataCy('agreement-elements-dropdown')
        .click()
        .then(() => {
          cy.get('ng-dropdown-panel').should('not.contain', 'Databaselicenser');
        });
      cy.dropdownByCy('agreement-elements-dropdown', 'Backup', true);
      cy.getByDataCy('confirm-button').click();
    });
    cy.get('app-popup-messages').should('exist');
  });

  it('delete agreement element', () => {
    goToSystem();

    cy.getByDataCy('delete-agreement-element-button').click();
    cy.verifyYesNoConfirmationDialogAndConfirm('PATCH', '/api/v2/it-contracts/*');
  });

  it('create contract system usage', () => {
    goToSystem();
    cy.intercept('/api/v2/internal/it-system-usages/search?organizationUuid=*', {
      fixture: './it-contracts/it-contract-system-search.json',
    });

    cy.getByDataCy('add-system-usage-button').click();
    cy.get('app-dialog').within(() => {
      cy.dropdownByCy('connected-dropdown-selector', 'test', true);
      cy.getByDataCy('confirm-button').click();
    });
    cy.get('app-popup-messages').should('exist');
  });

  it('delete contract system usage', () => {
    goToSystem();

    cy.getByDataCy('delete-system-usage-button').click();
    cy.verifyYesNoConfirmationDialogAndConfirm('PATCH', '/api/v2/it-contracts/*');
  });

  it('can display relations', () => {
    goToSystem();

    cy.getByDataCy('relations-table').within(() => {
      cy.contains('DefaultTestItSystem');
      cy.contains('test');
      cy.contains('interface');
      cy.contains('description');
      cy.contains('Læs mere');
      cy.contains('Kvartal');
    });
  });
});

function goToSystem() {
  cy.contains('Contract 1').click();
  cy.navigateToDetailsSubPage('IT Systemer');
}
