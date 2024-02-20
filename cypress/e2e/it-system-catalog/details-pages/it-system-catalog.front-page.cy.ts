/// <reference types="Cypress" />

describe('it-system-catalog', () => {
  beforeEach(() => {
    cy.requireIntercept();
    cy.intercept('/odata/ItSystems*', { fixture: './it-system-catalog/it-systems.json' });
    cy.intercept('/api/v2/it-systems/*', { fixture: './it-system-catalog/it-system.json' });
    cy.intercept('/api/v2/it-systems/*/permissions', { fixture: './it-system-catalog/it-system-permissions.json' });
    cy.intercept('/api/v2/business-types*', { fixture: './shared/business-types.json' });
    cy.intercept('/api/v2/internal/it-systems/search*', { fixture: './it-system-catalog/it-systems-v2.json' });
    cy.intercept('/api/v2/organizations', { fixture: './organizations/organizations-multiple.json' });
    cy.intercept('/api/v2/kle-options', { fixture: './it-system-catalog/kle/kles.json' });
    cy.setup(true, 'it-systems/it-system-catalog');

    //first find system in the table, then check it on the details page
    cy.contains('System 1').click();
    cy.contains('System 1');
  });

  it('fields contain correct data, and can be edited', () => {
    cy.intercept('PATCH', '/api/v2/it-systems/*', { fixture: './it-system-catalog/it-system.json' }).as('patch');

    const systemNameSelector = 'it-system-name';
    const newName = 'New name';
    //cy.getByDataCy(systemNameSelector).find('input').contains('System 1');
    cy.inputByCy(systemNameSelector).clear().type(newName);
    submitInput();
    verifyFrontPagePatchRequest({ name: newName });

    const parentSystemSelector = 'it-system-parent-system';
    //cy.getByDataCy(parentSystemSelector).should('have.value', 'System 3');
    cy.dropdownByCy(parentSystemSelector, 'System 2', true);
    verifyFrontPagePatchRequest({ parentUuid: 'ede11fff-cf8d-4fb4-8b89-d8822cce64b0' });

    const formerNameSelector = 'it-system-former-name';
    const newFormerName = 'Former name';
    //cy.getByDataCy(formerNameSelector).should('have.value', 'Old name');
    cy.inputByCy(formerNameSelector).clear().type(newFormerName);
    submitInput();
    verifyFrontPagePatchRequest({ previousName: newFormerName });

    const rightsHolderSelector = 'it-system-rights-holder';
    //cy.getByDataCy(rightsHolderSelector).should('have.value', 'TestOrg');
    cy.dropdownByCy(rightsHolderSelector, 'Fælles Kommune', true);
    verifyFrontPagePatchRequest({ rightsHolderUuid: '3dc52c64-3706-40f4-bf58-45035bb376da' });

    const businessTypeSelector = 'it-system-business-type';
    //cy.getByDataCy(businessTypeSelector).should('have.value', 'IT management (STORM)');
    cy.dropdownByCy(businessTypeSelector, 'GIS (STORM)', true);
    verifyFrontPagePatchRequest({ businessTypeUuid: '8ec94f16-df25-43bb-aff0-825b4aa7d175' });

    const visibilitySelector = 'it-system-visibility';
    //cy.getByDataCy(visibilitySelector).should('have.value', 'Internal');
    cy.dropdownByCy(visibilitySelector, 'Offentlig', true);
    verifyFrontPagePatchRequest({ scope: 'Global' });

    cy.inputByCy('it-system-uuid').should('have.value', '681385c4-4f4f-4de4-bafe-faa245f1b0e1');
    cy.getByDataCy('it-system-references').contains('test reference');

    const descriptionSelector = 'it-system-description';
    const newDescription = 'New description';
    //cy.getByDataCy(descriptionSelector).should('have.value', 'Old description');
    cy.inputByCy(descriptionSelector).clear().type(newDescription);
    cy.getByDataCy(formerNameSelector).click();
    verifyFrontPagePatchRequest({ description: newDescription });

    const archivingSelector = 'it-system-recommended-archive-duty';
    //cy.getByDataCy(archivingSelector).should('have.value', 'B');
    cy.dropdownByCy(archivingSelector, 'K');
    verifyFrontPagePatchRequest({ recommendedArchiveDuty: 'K' });

    const archivingCommentSelector = 'it-system-recommended-archive-duty-comment';
    const newComment = 'New comment';
    //cy.getByDataCy(archivingCommentSelector).should('have.value', 'Old comment').should('not.be.disabled');
    cy.inputByCy(archivingCommentSelector).clear().type(newComment);
    submitInput();
    verifyFrontPagePatchRequest({ recommendedArchiveDutyComment: newComment });

    cy.getByDataCy('it-system-kle').contains('TestKLEKey').contains('Test task ref');
  });
});

function verifyFrontPagePatchRequest(request: object) {
  cy.verifyRequestUsingDeepEq('patch', 'request.body', request);
}

function submitInput() {
  //in order for an input to send a request we need to defocus it
  cy.getByDataCy('it-system-description').click();
}
