/// <reference types="Cypress" />

describe('organization-master-data', () => {
  beforeEach(() => {
    cy.intercept('/api/v2/internal/organizations/*/masterData', {
      fixture: './organizations/organization-master-data.json',
    });
    cy.intercept('/api/v2/internal/organizations/*/masterData/roles', {
      fixture: './organizations/organization-master-data-roles.json',
    });
    cy.intercept('/api/v2/organizations/*/users', { fixture: './organizations/organization-users.json' });
    cy.intercept('/api/v2/internal/organizations/*/permissions', {
      fixture: './organizations/organization-permissions.json',
    });

    cy.setup(true, 'organization/master-data');
  });

  it('Can edit organization master data', () => {
    const newCvr = 'newOrgCvr';
    cy.intercept('/api/v2/internal/organizations/*/masterData').as('patch');

    cy.getByDataCy('master-data-cvr-input').type('{selectall}{backspace}').type(newCvr);
    cy.getByDataCy('master-data-headline').click();

    cy.verifyRequestUsingDeepEq('patch', 'request.body.cvr', newCvr);
  });

  it('Can edit data responsible role master data', () => {
    const newCvr = 'newDrCvr';
    cy.intercept('/api/v2/internal/organizations/*/masterData/roles').as('patch');

    cy.getByDataCy('data-responsible-cvr-input').type('{selectall}{backspace}').type(newCvr);
    cy.getByDataCy('master-data-headline').click();

    cy.wait('@patch').then((interception) => {
      expect(interception.request.body.dataResponsible).to.have.property('cvr', newCvr);
    });
  });

  it('Selecting contact person email from dropdown disables other contact person fields', () => {
    cy.intercept('api/v2/internal/organization/*/users/permissions', {
      fixture: './organizations/users/permissions.json',
    });
    cy.intercept('/api/v2/organizations/*/users', { fixture: './organizations/organization-users.json' });
    cy.intercept('/api/v2/internal/organizations/*/masterData/roles').as('patch');

    cy.dropdownByCy('contact-person-email-dropdown', 'local-global-admin-user@kitos.dk', true);

    cy.confirmTextboxStateByDataCy('contact-person-name-control', false);
    cy.confirmTextboxStateByDataCy('contact-person-last-name-control', false);
    cy.confirmTextboxStateByDataCy('contact-person-phone-control', false);
  });
});
