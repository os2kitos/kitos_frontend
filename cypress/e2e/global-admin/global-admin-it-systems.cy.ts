/// <reference types="Cypress" />

describe('global-admin-organizations', () => {
  beforeEach(() => {
    cy.requireIntercept();
    cy.intercept('api/v2/internal/it-systems/global-option-types/business-types', {
      fixture: './global-admin/it-system/business-types.json',
    });
    cy.intercept('api/v2/internal/it-systems/global-option-types/archive-types', { body: [] });
    cy.intercept('api/v2/internal/it-systems/global-option-types/archive-location-types', { body: [] });
    cy.intercept('api/v2/internal/it-systems/global-option-types/archive-test-location-types', { body: [] });
    cy.intercept('api/v2/internal/it-systems/global-option-types/data-types', { body: [] });
    cy.intercept('api/v2/internal/it-systems/global-option-types/frequency-types', { body: [] });
    cy.intercept('api/v2/internal/it-systems/global-option-types/interface-types', { body: [] });
    cy.intercept('api/v2/internal/it-systems/global-option-types/sensitive-personal-data-types', { body: [] });
    cy.intercept('api/v2/internal/it-systems/global-option-types/it-system-categories', { body: [] });
    cy.intercept('api/v2/internal/it-systems/global-option-types/register-types', { body: [] });
    cy.setup(true, 'global-admin/it-systems');
  });

  it('Can toggle business type enabled', () => {
    cy.intercept('PATCH', '/api/v2/internal/it-systems/global-option-types/business-types/*', {
      statusCode: 200,
      body: {},
    }).as('patch');

    cy.getByDataCy('option-type-accordion').first().click();
    cy.getByDataCy('disable-button').first().click();

    cy.wait('@patch').then((interception) => {
      expect(interception.request.body.isEnabled).to.equal(false);
    });
  });

  it('Can toggle business type priority', () => {
    cy.intercept('PATCH', '/api/v2/internal/it-systems/global-option-types/business-types/*', {
      statusCode: 200,
      body: {},
    }).as('patch');

    cy.getByDataCy('option-type-accordion').first().click();
    cy.getByDataCy('decrease-priority-button').first().click();

    cy.wait('@patch').then((interception) => {
      expect(interception.request.body.priority).to.equal(17);
    });
  });

  it('Can edit business type in dialog', () => {
    cy.intercept('PATCH', '/api/v2/internal/it-systems/global-option-types/business-types/*', {
      statusCode: 200,
      body: {},
    }).as('patch');
    const newName = 'someName';

    cy.getByDataCy('option-type-accordion').first().click();
    cy.getByDataCy('grid-edit-button').first().click();

    cy.replaceTextByDataCy('name-textbox', newName);
    cy.getByDataCy('save-button').click();

    cy.wait('@patch').then((interception) => {
      expect(interception.request.body.name).to.equal(newName);
    });
  });

  it('Can create business type in dialog', () => {
    cy.intercept('POST', 'api/v2/internal/it-systems/global-option-types/business-types', {
      statusCode: 200,
      body: {},
    }).as('post');
    const newName = 'someName';

    cy.getByDataCy('option-type-accordion').first().click();
    cy.getByDataCy('create-button').first().click();

    cy.replaceTextByDataCy('name-textbox', newName);
    cy.getByDataCy('obligatory-checkbox').click();
    cy.getByDataCy('save-button').click();

    cy.wait('@post').then((interception) => {
      expect(interception.request.body.name).to.equal(newName);
    });
  });
});
