/// <reference types="Cypress" />

describe('organization-structure', () => {
  beforeEach(() => {
    cy.requireIntercept();
    cy.intercept('/api/v2/organizations/*/organization-units', { fixture: './organizations/organization-units.json' });
  });

  it('Can delete organization unit', () => {
    cy.intercept('DELETE', 'api/v2/internal/organizations/*/organization-units/*/delete', {
      statusCode: 200,
      body: {},
    }).as('deleteUnit');
    cy.setup(true, 'organization/structure');
    cy.contains('test2').click();

    cy.getByDataCy('more-button').click().click();
    cy.getByDataCy('delete-button').click();
    cy.getByDataCy('confirm-button').click();

    cy.wait('@deleteUnit').then((interception) => {
      expect(interception.response?.statusCode).to.equal(200);
    });
  });
});
