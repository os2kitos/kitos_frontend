/// <reference types="Cypress" />

describe('global-admin-help-texts', () => {
  beforeEach(() => {
    cy.requireIntercept();
    cy.intercept('api/v2/internal/help-texts', {
      fixture: './global-admin/help-texts.json',
    });
    cy.setup(true, 'global-admin/help-texts');
  });

  it('Can create help text', () => {
    cy.intercept('POST', '/api/v2/internal/help-texts', {
      statusCode: 200,
      body: {},
    }).as('post');

    const key = 'someKey';
    const title = 'someTitle';
    const description = 'someDescription';

    cy.getByDataCy('create-button').click();
    cy.replaceTextByDataCy('key-input', key);
    cy.replaceTextByDataCy('title-input', title);
    cy.replaceTextByDataCy('description-input', description);
    cy.getByDataCy('dialog-actions').within(() => {
      cy.getByDataCy('save-button').click();

      cy.wait('@post').then((interception) => {
      expect(interception.request.body.key).to.equal(key);
      expect(interception.request.body.title).to.equal(title);
      expect(interception.request.body.description).to.equal(description);
    });
    });
  });
});
