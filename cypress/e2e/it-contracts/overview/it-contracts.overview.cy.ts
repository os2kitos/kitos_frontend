/// <reference types="Cypress" />

describe('it-contracts', () => {
  beforeEach(() => {
    cy.requireIntercept();
    cy.intercept('/odata/ItContract*', { fixture: './it-contracts/it-contracts.json' });
    cy.intercept('/api/v2/it-contracts/permissions*', { fixture: 'shared/create-permissions.json' });
    cy.setup(true, 'it-contracts');
  });

  it('can show IT contracts grid', () => {
    cy.get('h3').should('have.text', 'IT Kontrakter');

    cy.contains('Contract 1');
    cy.contains('Contract 2');
    cy.contains('Contract 3');
  });

  it('cant create if name already exists', () => {
    cy.intercept('/api/v2/it-contracts?nameEquals*', {
      fixture: './it-contracts/it-contracts-by-it-system-usage-uuid.json',
    });
    cy.getByDataCy('create-button').click();
    cy.inputByCy('create-name').type('The valid contract');
    // The name field waits for 500ms before calling the backend to verify if the name already exists
    cy.wait(500);
    cy.getByDataCy('name-error').should('exist');
  });
});
