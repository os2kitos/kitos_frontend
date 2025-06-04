describe('data-processing', () => {
  beforeEach(() => {
    cy.requireIntercept();
    cy.intercept('/odata/DataProcessingRegistrationReadModels*', {
      fixture: './dpr/data-processings-odata.json',
    });
    cy.intercept('/api/v1/data-processing-registration/available-options-in/organization/*', {
      fixture: 'dpr/data-processing-options.json',
    });
    cy.intercept('/api/v2/data-processing-registrations/permissions*', { fixture: 'shared/create-permissions.json' });
    cy.intercept('/api/v2/internal/organizations/*/grid/permissions', { statusCode: 404, body: {} });
    cy.intercept('/api/v2/internal/organizations/*/grid/*/*', { statusCode: 404, body: {} });
    cy.intercept('GET', 'api/v2/organizations/*/organization-units?pageSize=*', {
      fixture: './organizations/organization-units.json',
    });
  });

  it('can show data processing grid', () => {
    cy.setup(true, 'data-processing');
    cy.get('h3').should('have.text', 'Databehandling');

    cy.contains('Dpa 1');
    cy.contains('Dpa 2');
    cy.contains('Dpa 3');
  });

  it('cant create if name already exists', () => {
    cy.setup(true, 'data-processing');
    cy.intercept('/api/v2/data-processing-registrations?nameEquals*', {
      fixture: './dpr/data-processings-name-exists-search.json',
    });

    cy.getByDataCy('grid-options-button').click().click();
    cy.getByDataCy('create-button').click();
    cy.inputByCy('create-name').type('DefaultDpa');
    // The name field waits for 500ms before calling the backend to verify if the name already exists
    cy.wait(500);
    cy.getByDataCy('name-error').should('exist');
  });

  it('Can show responsible unit in grid', () => {
    cy.setup(true, 'data-processing');
    cy.getByDataCy('column-config-button').click();
    cy.contains('Ansvarlig org. enhed').click();
    cy.getByDataCy('column-config-dialog-save-button').click();

    cy.contains('En enhed').should('exist');
  });

  it('Can not see responsible unit, if disabled by UI customization', () => {
    cy.setup(true, 'data-processing', './shared/ui-customization/dpr-responsible-unit-disabled.json');

    cy.getByDataCy('column-config-button').click();
    cy.contains('Ansvarlig org. enhed').should('not.exist');
  });
});
