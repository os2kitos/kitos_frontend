/// <reference types="cypress" />

describe('organization-master-data', () => {
  beforeEach(() => {
    cy.intercept('api/v2/internal/organizations/*/master-data', {
      fixture: './organizations/organization-master-data.json',
    });
    cy.intercept('api/v2/internal/organizations/*/master-data/roles', {
      fixture: './organizations/organization-master-data-roles.json',
    });
    cy.intercept('api/v2/organizations/*/users*', { fixture: './organizations/organization-users.json' }).as(
      'organizationUsers',
    );
    cy.intercept('api/v2/internal/organizations/*/permissions', {
      fixture: './organizations/organization-permissions-global-admin.json',
    });

    cy.setup(true, 'organization/master-data');
  });

  // flaky test - https://os2web.atlassian.net/browse/KITOSUDV-5831
  // it('Can edit organization master data', () => {
  //   const newPhone = '12345678';
  //   cy.intercept('api/v2/internal/organizations/*/master-data').as('patch');

  //   cy.getByDataCy('master-data-phone-input').type('{selectall}{backspace}').type(newPhone);
  //   cy.getByDataCy('master-data-headline').click();

  //   cy.wait('@patch').then((interception) => {
  //     expect(interception.request.body.phone).to.equal(newPhone);
  //   });
  // });

  // it('Can edit data responsible role master data', () => {
  //   const newCvr = '12345678';
  //   cy.intercept('api/v2/internal/organizations/*/master-data/roles').as('patch');

  //   cy.getByDataCy('data-responsible-cvr-input').type('{selectall}{backspace}').type(newCvr);
  //   cy.wait(500);
  //   cy.getByDataCy('master-data-headline').click();

  //   cy.wait('@patch').then((interception) => {
  //     expect(interception.request.body.dataResponsible).to.have.property('cvr', newCvr);
  //   });
  // });

  it('Selecting contact person email from dropdown disables other contact person fields', () => {
    cy.wait('@organizationUsers');

    cy.getByDataCy('contact-person-email-dropdown').find('input').click({ force: true });
    cy.get('ng-dropdown-panel').contains('local-global-admin-user@kitos.dk').click();

    cy.confirmTextboxStateByDataCy('contact-person-name-control', false);
    cy.confirmTextboxStateByDataCy('contact-person-last-name-control', false);
    cy.confirmTextboxStateByDataCy('contact-person-phone-control', false);
  });
});
