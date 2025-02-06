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

    cy.getByDataCy('create-button').click();
    cy.replaceTextByDataCy('key-input', key);
    cy.replaceTextByDataCy('title-input', title);
    cy.getByDataCy('dialog-actions').within(() => {
      cy.getByDataCy('save-button').click();

      cy.wait('@post').then((interception) => {
      expect(interception.request.body.key).to.equal(key);
      expect(interception.request.body.title).to.equal(title);
    });
    });
  });

  it('Can delete help text', () => {
    cy.intercept('DELETE', '/api/v2/internal/help-texts/*', {
      statusCode: 200,
      body: {},
    }).as('delete');
    const key = 'it-system.usage.main';

    cy.getByDataCy('grid-delete-button').first().click();
    cy.getByDataCy('confirm-button').click();

    cy.wait('@delete').then((interception) => {
      expect(interception.request.url).to.contain(key);
  });
  });

  it('Can patch help text', () => {
    cy.intercept('PATCH', '/api/v2/internal/help-texts/*', {
      statusCode: 200,
      body: {},
    }).as('patch');

    const title = 'someTitle';

    cy.getByDataCy('grid-edit-button').first().click();
    cy.replaceTextByDataCy('title-input', title);
    cy.getByDataCy('dialog-actions').within(() => {
      cy.getByDataCy('save-button').click();

      cy.wait('@patch').then((interception) => {
      expect(interception.request.body.title).to.equal(title);
    });
    });
  });
});
