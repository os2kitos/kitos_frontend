/// <reference types="Cypress" />

describe('it-interfaces', () => {
  beforeEach(() => {
    cy.requireIntercept();
    cy.intercept('/odata/ItInterfaces*', { fixture: './it-interfaces/odata/it-interfaces.json' });
    cy.intercept('/api/v2/it-interfaces/permissions*', { fixture: 'shared/create-permissions.json' });
    cy.intercept('/api/v2/internal/organizations/*/grid/permissions', { statusCode: 404, body: {} });
    cy.intercept('/api/v2/internal/organizations/*/grid/*/*', { statusCode: 404, body: {} });
    cy.setup(true, 'it-systems/it-interfaces');
  });

  it('can show IT interfaces grid', () => {
    cy.get('h3').should('have.text', 'IT Snitfladekatalog');

    cy.contains('Interface 1');
    cy.contains('Interface 2');
  });

  it('cant create if name already exists', () => {
    cy.intercept('/api/v2/it-interfaces*', {
      fixture: './it-system-catalog/it-systems-v2.json',
    });
    cy.getByDataCy('grid-options-button').click().click();
    cy.getByDataCy('create-button').click();
    cy.inputByCy('create-name').type('test');
    cy.inputByCy('create-interface-id').type('1');
    // The name field waits for 500ms before calling the backend to verify if the name already exists
    cy.wait(500);
    cy.getByDataCy('error-message').should('exist');
  });
});
