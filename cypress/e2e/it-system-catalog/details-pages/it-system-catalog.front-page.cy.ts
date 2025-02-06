/// <reference types="Cypress" />

describe('it-system-catalog', () => {
  beforeEach(() => {
    cy.requireIntercept();
    cy.setupItSystemCatalogIntercepts();

    cy.intercept('/api/v2/it-system-usages/*/permissions', { fixture: './shared/permissions.json' });
    cy.setup(true, 'it-systems/it-system-catalog');
  });

  it('fields contain correct data, and can be edited', () => {
    goToDetails();
    cy.intercept('PATCH', '/api/v2/it-systems/*', { fixture: './it-system-catalog/it-system.json' }).as('patch');

    cy.getByDataCy('remove-usage-it-system-button').should('exist');

    const systemNameSelector = 'it-system-name';
    const newName = 'New name';
    cy.inputByCy(systemNameSelector).should('have.value', 'System 1');
    cy.inputByCy(systemNameSelector).clear().type(newName);
    submitInput();
    verifyFrontPagePatchRequest({ name: newName });

    const parentSystemSelector = 'it-system-parent-system';
    cy.dropdownByCy(parentSystemSelector, 'System 2', true);
    verifyFrontPagePatchRequest({ parentUuid: 'ede11fff-cf8d-4fb4-8b89-d8822cce64b0' });

    const formerNameSelector = 'it-system-former-name';
    const newFormerName = 'Former name';
    cy.inputByCy(formerNameSelector).should('have.value', 'Old name');
    cy.inputByCy(formerNameSelector).clear().type(newFormerName);
    submitInput();
    verifyFrontPagePatchRequest({ previousName: newFormerName });

    const rightsHolderSelector = 'it-system-rights-holder';
    cy.dropdownByCy(rightsHolderSelector, 'Fælles Kommune', true);
    verifyFrontPagePatchRequest({ rightsHolderUuid: '3dc52c64-3706-40f4-bf58-45035bb376da' });

    const businessTypeSelector = 'it-system-business-type';
    cy.dropdownByCy(businessTypeSelector, 'GIS (STORM)', true);
    verifyFrontPagePatchRequest({ businessTypeUuid: '8ec94f16-df25-43bb-aff0-825b4aa7d175' });

    const visibilitySelector = 'it-system-visibility';
    cy.dropdownByCy(visibilitySelector, 'Offentlig', true);
    verifyFrontPagePatchRequest({ scope: 'Global' });

    cy.inputByCy('it-system-uuid').should('have.value', '681385c4-4f4f-4de4-bafe-faa245f1b0e1');
    const referencesSelector = 'it-system-references';
    cy.getByDataCy(referencesSelector).contains('Invalid url');
    cy.getByDataCy(referencesSelector).contains('(www.google.com)');
    cy.getByDataCy(referencesSelector).contains('Valid url');
    cy.getByDataCy(referencesSelector).contains('No url Master reference');

    const descriptionSelector = 'it-system-description';
    const newDescription = 'New description';
    cy.textareaByCy(descriptionSelector).should('have.value', 'Old description');
    cy.textareaByCy(descriptionSelector).clear().type(newDescription);
    cy.getByDataCy(formerNameSelector).click();
    verifyFrontPagePatchRequest({ description: newDescription });

    const archivingSelector = 'it-system-recommended-archive-duty';
    const oldComment = 'Old comment';
    const newValue = 'K';
    cy.dropdownByCy(archivingSelector, newValue, true);
    verifyFrontPagePatchRequest({ recommendedArchiveDuty: { id: newValue, comment: oldComment } });

    const archivingCommentSelector = 'it-system-recommended-archive-duty-comment';
    const newComment = 'New comment';
    cy.textareaByCy(archivingCommentSelector).should('have.value', 'Old comment').should('not.be.disabled');
    cy.textareaByCy(archivingCommentSelector).clear().type(newComment);
    submitInput();
    verifyFrontPagePatchRequest({ recommendedArchiveDuty: { id: 'B', comment: newComment } });

    const kleSelector = 'it-system-kle';
    cy.getByDataCy(kleSelector).contains('TestKLEKey');
    cy.getByDataCy(kleSelector).contains('Test task ref');
  });

  it('is add usage button and disable button visible', () => {
    cy.intercept('/api/v2/it-systems/*', { fixture: './it-system-catalog/it-system-active-not-in-usage.json' });

    goToDetails();

    cy.getByDataCy('add-usage-it-system-button').should('exist');
    cy.getByDataCy('disable-it-system-button').should('exist');
  });

  it('is enable button and delete button visible', () => {
    cy.intercept('/api/v2/it-systems/*', { fixture: './it-system-catalog/it-system-inactive-not-in-usage.json' });

    goToDetails();

    cy.getByDataCy('delete-it-system-button').should('exist');
    cy.getByDataCy('enable-it-system-button').should('exist');
  });
});

function verifyFrontPagePatchRequest(request: object) {
  cy.verifyRequestUsingDeepEq('patch', 'request.body', request);
}

function submitInput() {
  //in order for an input to send a request we need to defocus it
  cy.getByDataCy('it-system-description').click();
}

function goToDetails() {
  cy.contains('System 1').click();
  cy.contains('System 1');
}
