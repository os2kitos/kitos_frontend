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
    cy.contains('test2').should('not.exist');
  });
});
/// <reference types="Cypress" />

describe('organization-structure', () => {
  beforeEach(() => {
    cy.requireIntercept();
    cy.intercept('/api/v2/organizations/*//organization-units', { fixture: './organization/organization-units.json' });
  });

  it('can save changes if valid form', () => {
    cy.intercept('PATCH', '/api/v2/internal/organizations/*/organization-units/*/patch', {
      statusCode: 200,
      body: {},
    }).as('patchUnit');
    const eanNumber = '11';
    const name = 'NewName';
    cy.setup(true, 'organization/structure');

    cy.getByDataCy('edit-button').click();
    cy.getByDataCy('ean-control').type(eanNumber);
    cy.getByDataCy('name-control').type(name);
    cy.getByDataCy('save-button').click();

    cy.wait('@patchUnit').then((interception) => {
      expect(interception.request.body).to.contain({
        ean: eanNumber,
        name: 'test1' + name,
      });
      expect(interception.response?.statusCode).to.equal(200);
    });
  });
});
