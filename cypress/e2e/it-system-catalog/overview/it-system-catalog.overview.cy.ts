/// <reference types="Cypress" />

describe('it-system-catalog', () => {
  beforeEach(() => {
    cy.requireIntercept();
    cy.intercept('/odata/ItSystems*', { fixture: './it-system-catalog/it-systems.json' });
    cy.intercept('/api/v2/it-systems/permissions*', { fixture: 'shared/create-permissions.json' });
    cy.setup(true, 'it-systems/it-system-catalog');
  });

  it('can show IT system usage grid', () => {
    cy.get('h3').should('have.text', 'IT Systemkatalog');

    cy.contains('System 1');
    cy.contains('System 2');
  });

  it('cant create if name already exists', () => {
    cy.intercept('/api/v2/internal/it-systems/search*', {
      fixture: './it-system-catalog/it-systems-v2.json',
    });
    cy.getByDataCy('create-button').click();
    cy.inputByCy('create-name').type('System 1');
    // The name field waits for 500ms before calling the backend to verify if the name already exists
    cy.wait(500);
    cy.getByDataCy('name-error').should('exist');
  });
});
