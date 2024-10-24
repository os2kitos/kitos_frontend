/// <reference types="Cypress" />

describe('local-admin information', () => {
  beforeEach(() => {
    cy.requireIntercept();
    cy.setup(true);
  });

  it('can edit just organization name if local admin', () => {
    const newName = 'someOrg';
    cy.intercept('/api/v2/internal/organizations/*/permissions', {
      fixture: './organizations/organization-permissions-local-admin.json',
    });
    cy.intercept('PATCH', '/api/v2/internal/organizations/*/patch', {
      statusCode: 200,
      body: { }
    }).as('patch');


    cy.hoverByDataCy('profile-menu');
    cy.getByDataCy('local-admin-menu-item').should('exist').click();

    cy.confirmTextboxStateByDataCy('name-input', true);
    cy.confirmTextboxStateByDataCy('cvr-input', false);
    cy.replaceTextByDataCy('name-input', newName);
    cy.getByDataCy('info-title').click();

    cy.wait('@patch', { timeout: 10000 }).then((interception) => {
      expect(interception.request.body.name).to.equal(newName);
    });
  });

  it('can edit cvr if global admin', () => {
    const newCvr = '1234';
    cy.intercept('/api/v2/internal/organizations/*/permissions', {
      fixture: './organizations/organization-permissions-global-admin.json',
    });
    cy.intercept('PATCH', '/api/v2/internal/organizations/*/patch', {
      statusCode: 200,
      body: { }
    }).as('patch');


    cy.hoverByDataCy('profile-menu');
    cy.getByDataCy('local-admin-menu-item').should('exist').click();

    cy.confirmTextboxStateByDataCy('cvr-input', true);
    cy.replaceTextByDataCy('cvr-input', newCvr);
    cy.getByDataCy('info-title').click();

    cy.wait('@patch', { timeout: 10000 }).then((interception) => {
      expect(interception.request.body.cvr).to.equal(newCvr);
    });
  });
});
