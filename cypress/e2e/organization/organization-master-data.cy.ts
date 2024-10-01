/// <reference types="Cypress" />

describe('organization-master-data', () => {
  beforeEach(() => {
    cy.intercept('/api/v2/internal/organizations/*/masterData', {
      fixture: './organizations/organization-master-data.json',
    });
    cy.intercept('/api/v2/internal/organizations/*/masterData/roles', {
      fixture: './organizations/organization-master-data-roles.json',
    });
    cy.setup(true, 'organization/master-data');
  });

  it('Can edit organization master data', () => {
    const newCvr = 'newCvr';
    cy.intercept('/api/v2/internal/organizations/*/masterData').as('patch');

    cy.getByDataCy('master-data-cvr-input').type('{selectall}{backspace}').type(newCvr);
    cy.getByDataCy('master-data-headline').click();

    cy.wait('@patch').then((interception) => {
      expect(interception.request.body).to.deep.equal({ cvr: newCvr });
    });
  });
});
