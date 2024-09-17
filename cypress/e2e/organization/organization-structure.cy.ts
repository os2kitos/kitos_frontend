/// <reference types="Cypress" />

describe('organization-structure', () => {
  beforeEach(() => {
    cy.requireIntercept();
    cy.intercept('/api/v2/organizations/*/organization-units', { fixture: './organizations/organization-units.json' });
    cy.intercept('/api/v2/internal/organizations/*/organization-units/*/permissions', {
      fixture: './organizations/organization-unit-permissions.json',
    });
    cy.intercept('/api/v2/internal/organizations/*/organization-units/*/registrations', {
      fixture: './organizations/organization-units-registration.json',
    });
    cy.setup(true, 'organization/structure');
  });

  it('Can start and end restructure state', () => {
    cy.getByDataCy('actions-button').click().click();
    cy.contains('Omstrukturer').click();

    cy.getByDataCy('drag-icon').should('exist');
    cy.getByDataCy('finish-restructure-button').click();
    cy.getByDataCy('drag-icon').should('not.exist');
  });

  it('can save changes if valid form', () => {
    cy.intercept('PATCH', '/api/v2/internal/organizations/*/organization-units/*/patch', {
      statusCode: 200,
      body: {},
    }).as('patchUnit');
    const eanNumber = '11';
    const name = 'NewName';
    const unitId = 'someId';

    cy.getByDataCy('edit-button').click();
    cy.replaceTextByDataCy('ean-control', eanNumber);
    cy.replaceTextByDataCy('name-control', name);
    cy.replaceTextByDataCy('id-control', unitId);

    cy.getByDataCy('save-button').click();
    cy.wait('@patchUnit').then((interception) => {
      expect(interception.request.body).to.contain({
        ean: eanNumber,
        name: name,
        localId: unitId,
      });
      expect(interception.response?.statusCode).to.equal(200);
    });
  });

  it('Can delete organization unit', () => {
    cy.intercept('DELETE', '/api/v2/internal/organizations/*/organization-units/*/delete', {
      statusCode: 200,
      body: {},
    }).as('deleteUnit');
    cy.contains('test2').click();

    cy.getByDataCy('edit-button').click();
    cy.getByDataCy('delete-unit-button').click();
    cy.getByDataCy('confirm-button').click();

    cy.wait('@deleteUnit').then((interception) => {
      expect(interception.response?.statusCode).to.equal(200);
    });
    cy.contains('test2').should('not.exist');
  });

  it('Can delete registrations', () => {
    cy.getByDataCy('edit-button').click();

    cy.getByDataCy('select-all-button').click();
    cy.getByDataCy('actions-snackbar').should('exist');
    cy.getByDataCy('delete-selected-button').click();
    const message = 'Denne handling kan ikke fortrydes.';
    const title = 'Vil du slette de valgte registreringer?';
    cy.verifyYesNoConfirmationDialogAndConfirm('PATCH', '', undefined, message, title);
  });

  it('Can transfer registrations', () => {
    cy.getByDataCy('edit-button').click();

    cy.getByDataCy('select-all-button').click();
    cy.dropdownByCy('transfer-to-unit-select', 'test2', true);
    cy.getByDataCy('actions-snackbar').should('exist');
    cy.getByDataCy('transfer-selected-button').click();
    const message = 'Denne handling kan ikke fortrydes.';
    const title = 'Vil du overføre de valgte registreringer?';
    cy.verifyYesNoConfirmationDialogAndConfirm('PATCH', '', undefined, message, title);
  });
});
