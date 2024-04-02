/// <reference types="Cypress" />

describe('it-system-interfaces', () => {
  beforeEach(() => {
    cy.requireIntercept();
    cy.intercept('/odata/ItInterfaces*', { fixture: './it-interfaces/odata/it-interfaces.json' });
    cy.intercept('/api/v2/it-interfaces/*/permissions', { fixture: './it-interfaces/it-interfaces-permissions.json' });
    cy.intercept('/api/v2/it-interfaces**', { fixture: './it-interfaces/it-interface.json' });
    cy.intercept('/api/v2/it-interface-interface-types*', { fixture: './it-interfaces/it-interfaces-types.json' });
    cy.intercept('/api/v2/it-interface-interface-data-types*', {
      fixture: './it-interfaces/it-interfaces-data-types.json',
    });
    cy.intercept('/api/v2/internal/it-systems/search?includeDeactivated=false', {
      fixture: './it-system-catalog/it-systems-internal-search.json',
    });
    cy.setup(true, 'it-systems/it-interfaces');
  });

  it('interface information area fields contain correct data, and can be edited', () => {
    cy.intercept('/api/v2/it-interfaces/27c3e673-1111-46dc-8e44-2ba278901eae', {
      fixture: './it-interfaces/it-interface.json',
    });
    goToInterfaceDetails();
    cy.intercept('PATCH', '/api/v2/it-interfaces/*', { fixture: './it-interfaces/it-interface.json' }).as('patch');

    const nameSelector = 'interface-name';
    const newName = 'New name';
    cy.inputByCy(nameSelector).should('have.value', 'test');
    cy.inputByCy(nameSelector).clear().type(newName);
    submitInterfaceInput();
    verifyInterfaceFrontPagePatchRequest({ name: newName });

    const interfaceIdSelector = 'interface-id';
    const newInterfaceId = 'NewId';
    cy.inputByCy(interfaceIdSelector).should('have.value', 'testId');
    cy.inputByCy(interfaceIdSelector).clear().type(newInterfaceId);
    submitInterfaceInput();
    verifyInterfaceFrontPagePatchRequest({ interfaceId: newInterfaceId });

    const versionSelector = 'interface-version';
    const newVersion = 'V2';
    cy.inputByCy(versionSelector).should('have.value', 'testVersion');
    cy.inputByCy(versionSelector).clear().type(newVersion);
    submitInterfaceInput();
    verifyInterfaceFrontPagePatchRequest({ version: newVersion });

    const systemSelector = 'interface-system';
    cy.dropdownByCy(systemSelector, 'System 2', true);
    verifyInterfaceFrontPagePatchRequest({ exposedBySystemUuid: '33260834-333a-4820-8e1f-d1b05edf6dd0' });

    cy.wait(1000);

    const scopeSelector = 'interface-visibility';
    cy.dropdownByCy(scopeSelector, 'Offentlig', true);
    verifyInterfaceFrontPagePatchRequest({ scope: 'Global' });

    const typeSelector = 'interface-type';
    cy.dropdownByCy(typeSelector, 'InterfaceType2', true);
    verifyInterfaceFrontPagePatchRequest({ itInterfaceTypeUuid: '11fb8cbb-0eb2-482c-b8f7-029017a22b33' });

    cy.inputByCy('interface-uuid').should('have.value', '06f0000e-4fb9-4ea2-bb57-03430ee2a632');
    cy.inputByCy('interface-create-by').should('have.value', 'Automatisk oprettet testbruger (LocalAdmin)');
    cy.inputByCy('interface-rights-holder').should('have.value', 'Fælles Kommune');

    cy.inputByCy('interface-link').getByDataCy('edit-link-button').click();

    cy.get('app-dialog').within(() => {
      cy.inputByCy('url-textbox').clear().type('newurl');
      cy.getByDataCy('edit-url-save-button').click();
    });
    verifyInterfaceFrontPagePatchRequest({ urlReference: 'newurl' });

    const descriptionSelector = 'interface-description';
    const newDescription = 'New description';
    cy.textareaByCy(descriptionSelector).should('have.value', 'test description');
    cy.textareaByCy(descriptionSelector).clear().type(newDescription);
    submitInterfaceInput();
    verifyInterfaceFrontPagePatchRequest({ description: newDescription });

    const notesSelector = 'interface-notes';
    const newNote = 'New note';
    cy.textareaByCy(notesSelector).should('have.value', 'test note');
    cy.textareaByCy(notesSelector).clear().type(newNote);
    cy.textareaByCy(descriptionSelector).click();
    verifyInterfaceFrontPagePatchRequest({ note: newNote });
  });

  it('can add interface data', () => {
    cy.intercept('/api/v2/it-interfaces/27c3e673-1111-46dc-8e44-2ba278901eae', {
      fixture: './it-interfaces/it-interface.json',
    });
    goToInterfaceDetails();

    cy.getByDataCy('add-data-button').click();
    cy.get('app-dialog').within(() => {
      cy.intercept('/api/v2/it-interfaces/**', {});
      cy.inputByCy('data-textbox').type('Data description');
      cy.dropdownByCy('data-type-dropdown', 'Dokument', true);
      cy.getByDataCy('write-data-save-button').click();
    });
  });

  it('can edit interface data', () => {
    cy.intercept('/api/v2/it-interfaces/27c3e673-1111-46dc-8e44-2ba278901eae', {
      fixture: './it-interfaces/it-interface.json',
    });
    goToInterfaceDetails();

    cy.getByDataCy('edit-data-button').click();
    cy.get('app-dialog').within(() => {
      cy.intercept('/api/v2/it-interfaces/**', {});
      cy.inputByCy('data-textbox').should('have.value', 'test').clear().type('Data description');
      cy.dropdownByCy('data-type-dropdown', 'Dokument', true);
      cy.getByDataCy('write-data-save-button').click();
    });
  });

  it('can delete interface data', () => {
    cy.intercept('/api/v2/it-interfaces/27c3e673-1111-46dc-8e44-2ba278901eae', {
      fixture: './it-interfaces/it-interface.json',
    });
    goToInterfaceDetails();

    cy.getByDataCy('remove-data-button').click();
    cy.verifyYesNoConfirmationDialogAndConfirm(
      'DELETE',
      'api/v2/it-interfaces/*/data/*',
      {},
      'Er du sikker?',
      'Er du sikker på du vil slette data'
    );
  });
});

function verifyInterfaceFrontPagePatchRequest(request: object) {
  cy.verifyRequestUsingDeepEq('patch', 'request.body', request);
}

function goToInterfaceDetails() {
  cy.contains('Interface 1').click();
}

function submitInterfaceInput() {
  //in order for an input to send a request we need to defocus it
  cy.getByDataCy('interface-notes').click();
}
